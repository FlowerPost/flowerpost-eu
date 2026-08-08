"""
FLOWERPOST box — single source of truth for the 3D asset.

Regenerates the entire model from an empty scene: geometry, materials,
embossed logo, satin bow, interior roses, lighting, camera, then exports
public/models/flowerpost-box.glb and saves blender/flowerpost-box.blend.

Run headless, no GUI round-trip:
    blender --background --python blender/build_box.py

Any geometry/material change goes here, not through the GUI or MCP addon.
Re-running is idempotent — it starts from bpy.ops.wm.read_factory_settings
and rebuilds everything deterministically.
"""

import math
import os

import bmesh
import bpy
from mathutils import Vector, noise

# ---------------------------------------------------------------------------
# paths
# ---------------------------------------------------------------------------

BLENDER_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BLENDER_DIR)
GLB_EXPORT_PATH = os.path.join(PROJECT_ROOT, "public", "models", "flowerpost-box.glb")
BLEND_SAVE_PATH = os.path.join(BLENDER_DIR, "flowerpost-box.blend")

FONT_REGULAR = r"C:\Windows\Fonts\georgia.ttf"
FONT_ITALIC = r"C:\Windows\Fonts\georgiai.ttf"

# ---------------------------------------------------------------------------
# box dimensions (Blender units; 1 unit == 100mm, matches real 550x320x130mm)
# ---------------------------------------------------------------------------

BOX_W, BOX_D, BODY_H = 5.5, 3.2, 1.30
WALL_T = 0.07
BEVEL_R = 0.018

LID_W, LID_D = BOX_W + 0.10, BOX_D + 0.10
LID_T = 0.05
LID_SKIRT_TOP = BODY_H + 0.07
LID_SKIRT_BOT = BODY_H - 0.34
LID_TOP_Z = LID_SKIRT_TOP

RIBBON_W, RIBBON_T = 0.30, 0.022
EMBOSS = 0.018

# ---------------------------------------------------------------------------
# colour helpers
# ---------------------------------------------------------------------------


def srgb(hex_str, a=1.0):
    hex_str = hex_str.lstrip("#")
    r, g, b = (int(hex_str[i : i + 2], 16) / 255 for i in (0, 2, 4))
    f = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return (f(r), f(g), f(b), a)


# ---------------------------------------------------------------------------
# scene reset
# ---------------------------------------------------------------------------


def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


# ---------------------------------------------------------------------------
# materials
# ---------------------------------------------------------------------------


def fresh_material(name):
    existing = bpy.data.materials.get(name)
    if existing:
        bpy.data.materials.remove(existing)
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    out.location = (900, 0)
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.location = (500, 0)
    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat, nt, bsdf


def build_materials():
    # paper: ivory, matte, fine grain bump + roughness variation
    mat, nt, b = fresh_material("Mat_Box_Paper")
    b.inputs["Base Color"].default_value = srgb("E8DFD0")
    b.inputs["Metallic"].default_value = 0.0
    b.inputs["Specular IOR Level"].default_value = 0.28
    tc = nt.nodes.new("ShaderNodeTexCoord")
    tc.location = (-800, -100)
    n1 = nt.nodes.new("ShaderNodeTexNoise")
    n1.location = (-500, -150)
    n1.inputs["Scale"].default_value = 480.0
    n1.inputs["Detail"].default_value = 2.0
    n1.inputs["Roughness"].default_value = 0.7
    nt.links.new(tc.outputs["Object"], n1.inputs["Vector"])
    mr = nt.nodes.new("ShaderNodeMapRange")
    mr.location = (-250, -150)
    mr.inputs["To Min"].default_value = 0.82
    mr.inputs["To Max"].default_value = 0.95
    nt.links.new(n1.outputs["Fac"], mr.inputs["Value"])
    nt.links.new(mr.outputs["Result"], b.inputs["Roughness"])
    bump = nt.nodes.new("ShaderNodeBump")
    bump.location = (250, -350)
    bump.inputs["Strength"].default_value = 0.06
    bump.inputs["Distance"].default_value = 0.004
    nt.links.new(n1.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])

    # navy satin ribbon: directional sheen, not mirror gloss
    mat, nt, b = fresh_material("Mat_Ribbon_Satin")
    b.inputs["Base Color"].default_value = srgb("1B2843")
    b.inputs["Metallic"].default_value = 0.0
    b.inputs["Roughness"].default_value = 0.22
    b.inputs["Specular IOR Level"].default_value = 0.6
    if "Anisotropic" in b.inputs:
        b.inputs["Anisotropic"].default_value = 0.55
    if "Sheen Weight" in b.inputs:
        b.inputs["Sheen Weight"].default_value = 0.35
        b.inputs["Sheen Roughness"].default_value = 0.3
        b.inputs["Sheen Tint"].default_value = srgb("4A5A80")
    if "Coat Weight" in b.inputs:
        b.inputs["Coat Weight"].default_value = 0.15
        b.inputs["Coat Roughness"].default_value = 0.25

    # bronze foil logo: readable, catches light like a foil stamp (not flat metal)
    mat, nt, b = fresh_material("Mat_Logo_Bronze")
    b.inputs["Base Color"].default_value = srgb("B08D6A")
    b.inputs["Metallic"].default_value = 0.55
    b.inputs["Roughness"].default_value = 0.34
    b.inputs["Specular IOR Level"].default_value = 0.6

    # rose / leaf / tissue
    mat, nt, b = fresh_material("Mat_Rose")
    b.inputs["Base Color"].default_value = srgb("7A1E2A")
    b.inputs["Roughness"].default_value = 0.42
    if "Subsurface Weight" in b.inputs:
        b.inputs["Subsurface Weight"].default_value = 0.15
        if "Subsurface Radius" in b.inputs:
            b.inputs["Subsurface Radius"].default_value = (0.3, 0.08, 0.08)

    mat, nt, b = fresh_material("Mat_Rose2")
    b.inputs["Base Color"].default_value = srgb("5C1A24")
    b.inputs["Roughness"].default_value = 0.45
    if "Subsurface Weight" in b.inputs:
        b.inputs["Subsurface Weight"].default_value = 0.12
        if "Subsurface Radius" in b.inputs:
            b.inputs["Subsurface Radius"].default_value = (0.3, 0.08, 0.08)

    fresh_material("Mat_Leaf")[2].inputs["Base Color"].default_value = srgb("2F4A2A")
    bpy.data.materials["Mat_Leaf"].node_tree.nodes["Principled BSDF"].inputs[
        "Roughness"
    ].default_value = 0.55

    fresh_material("Mat_Tissue")[2].inputs["Base Color"].default_value = srgb("F3ECDD")
    bpy.data.materials["Mat_Tissue"].node_tree.nodes["Principled BSDF"].inputs[
        "Roughness"
    ].default_value = 0.9

    # floor (render-test only, never exported)
    mat, nt, b = fresh_material("Mat_Floor_Marble")
    b.inputs["Base Color"].default_value = srgb("D8C7AE")
    b.inputs["Roughness"].default_value = 0.35
    b.inputs["Specular IOR Level"].default_value = 0.4
    noise_tex = nt.nodes.new("ShaderNodeTexNoise")
    noise_tex.location = (-300, -150)
    noise_tex.inputs["Scale"].default_value = 6.0
    noise_tex.inputs["Detail"].default_value = 8.0
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.location = (0, -150)
    ramp.color_ramp.elements[0].color = srgb("CBB89C")
    ramp.color_ramp.elements[1].color = srgb("E4D6BE")
    nt.links.new(noise_tex.outputs["Fac"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], b.inputs["Base Color"])


# ---------------------------------------------------------------------------
# box body + lid (boolean-carved shells, clean manifold geometry)
# ---------------------------------------------------------------------------


def solid_box(name, sx, sy, sz, cx, cy, cz):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(cx, cy, cz))
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (sx, sy, sz)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return obj


def carve(target, cutter):
    bpy.context.view_layer.objects.active = target
    mod = target.modifiers.new("cut", type="BOOLEAN")
    mod.operation = "DIFFERENCE"
    mod.object = cutter
    mod.solver = "EXACT"
    bpy.ops.object.modifier_apply(modifier="cut")
    bpy.data.objects.remove(cutter, do_unlink=True)


def apply_bevel(obj):
    mod = obj.modifiers.new("Bevel", type="BEVEL")
    mod.width = BEVEL_R
    mod.segments = 2
    mod.limit_method = "ANGLE"
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier="Bevel")


def build_body_and_lid():
    paper = bpy.data.materials["Mat_Box_Paper"]

    base = solid_box("Box_Body", BOX_W, BOX_D, BODY_H, 0, 0, BODY_H / 2)
    carve(
        base,
        solid_box(
            "_bc", BOX_W - 2 * WALL_T, BOX_D - 2 * WALL_T, BODY_H, 0, 0, BODY_H / 2 + WALL_T
        ),
    )
    apply_bevel(base)
    base.data.materials.clear()
    base.data.materials.append(paper)

    sk_h = LID_SKIRT_TOP - LID_SKIRT_BOT
    sk_cz = (LID_SKIRT_TOP + LID_SKIRT_BOT) / 2
    lid = solid_box("Box_Lid", LID_W, LID_D, sk_h, 0, 0, sk_cz)
    carve(
        lid,
        solid_box(
            "_lc",
            LID_W - 2 * LID_T,
            LID_D - 2 * LID_T,
            sk_h,
            0,
            0,
            sk_cz - LID_T,
        ),
    )
    apply_bevel(lid)
    lid.data.materials.clear()
    lid.data.materials.append(paper)

    # hinge pivot at the back-top edge
    bpy.context.scene.cursor.location = Vector((0, LID_D / 2 - LID_T / 2, LID_SKIRT_TOP))
    for o in bpy.data.objects:
        o.select_set(False)
    lid.select_set(True)
    bpy.context.view_layer.objects.active = lid
    bpy.ops.object.origin_set(type="ORIGIN_CURSOR")
    bpy.context.scene.cursor.location = Vector((0, 0, 0))

    return base, lid


# ---------------------------------------------------------------------------
# embossed logo: "flower" + rose rosette + "post", subtitle below
# ---------------------------------------------------------------------------


def load_font(path):
    if os.path.exists(path):
        return bpy.data.fonts.load(path)
    return bpy.data.fonts[0] if bpy.data.fonts else None


def build_logo(lid):
    bronze = bpy.data.materials["Mat_Logo_Bronze"]
    base_z = LID_TOP_Z + 0.001

    font_regular = load_font(FONT_REGULAR)
    font_italic = load_font(FONT_ITALIC)

    made = []

    def text(name, body, size, x, y, font, spacing=1.0):
        cu = bpy.data.curves.new(name, type="FONT")
        cu.body = body
        cu.font = font
        cu.size = size
        cu.align_x = "CENTER"
        cu.align_y = "CENTER"
        cu.space_character = spacing
        cu.extrude = EMBOSS
        obj = bpy.data.objects.new(name, cu)
        bpy.context.collection.objects.link(obj)
        obj.location = (x, y, base_z)
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.convert(target="MESH")
        obj.select_set(False)
        made.append(obj)
        return obj

    text("Logo_Flower", "flower", 0.40, -0.92, 0.10, font_regular)
    text("Logo_Post", "post", 0.40, 0.92, 0.10, font_regular)
    text("Logo_Sub", "made to brighten your day", 0.115, 0.0, -0.42, font_italic, spacing=1.25)

    # rose rosette between the words: 5 petals + bud + stem + 2 leaves
    rose_cx, rose_cy = 0.0, 0.12
    rose_parts = []
    for i in range(5):
        ang = math.radians(90 + i * 72)
        px = rose_cx + math.cos(ang) * 0.11
        py = rose_cy + math.sin(ang) * 0.11
        bpy.ops.mesh.primitive_cylinder_add(
            vertices=20,
            radius=0.085,
            depth=EMBOSS * 2,
            location=(px, py, base_z),
            rotation=(0, 0, ang),
        )
        petal = bpy.context.active_object
        petal.name = f"petal{i}"
        petal.scale = (1.0, 0.6, 1.0)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        rose_parts.append(petal)

    bpy.ops.mesh.primitive_cylinder_add(
        vertices=24, radius=0.075, depth=EMBOSS * 2.4, location=(rose_cx, rose_cy, base_z)
    )
    bud = bpy.context.active_object
    bud.name = "rosebud"
    rose_parts.append(bud)

    bpy.ops.mesh.primitive_cube_add(size=1, location=(rose_cx, rose_cy - 0.24, base_z))
    stem = bpy.context.active_object
    stem.name = "stem"
    stem.scale = (0.022, 0.26, EMBOSS * 2)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    rose_parts.append(stem)

    for sx in (-1, 1):
        bpy.ops.mesh.primitive_cylinder_add(
            vertices=16,
            radius=0.05,
            depth=EMBOSS * 2,
            location=(rose_cx + sx * 0.06, rose_cy - 0.22, base_z),
            rotation=(0, 0, math.radians(sx * 40)),
        )
        leaf = bpy.context.active_object
        leaf.name = f"leaf{sx}"
        leaf.scale = (1.0, 0.45, 1.0)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        rose_parts.append(leaf)

    for o in bpy.data.objects:
        o.select_set(False)
    for p in rose_parts:
        p.select_set(True)
    bpy.context.view_layer.objects.active = rose_parts[0]
    bpy.ops.object.join()
    rose_parts[0].name = "Logo_Rose"
    made.append(rose_parts[0])

    for o in bpy.data.objects:
        o.select_set(False)
    for o in made:
        o.select_set(True)
    bpy.context.view_layer.objects.active = made[0]
    bpy.ops.object.join()
    logo = made[0]
    logo.name = "Logo_Mark"
    logo.data.materials.clear()
    logo.data.materials.append(bronze)

    # lossless planar decimate: font tessellation is far denser than needed
    dec = logo.modifiers.new("dec", type="DECIMATE")
    dec.decimate_type = "DISSOLVE"
    dec.angle_limit = math.radians(3)
    bpy.context.view_layer.objects.active = logo
    bpy.ops.object.modifier_apply(modifier="dec")

    logo.parent = lid
    logo.matrix_parent_inverse = lid.matrix_world.inverted()
    return logo


# ---------------------------------------------------------------------------
# ribbon: diagonal wrap strap + satin bow (swept flat strips, no tube/torus look)
# ---------------------------------------------------------------------------


def catmull(pts, seg=10):
    padded = [pts[0]] + list(pts) + [pts[-1]]
    out = []
    for i in range(1, len(padded) - 2):
        p0, p1, p2, p3 = padded[i - 1], padded[i], padded[i + 1], padded[i + 2]
        for s in range(seg):
            t = s / seg
            t2, t3 = t * t, t * t * t
            v = 0.5 * (
                (2 * p1)
                + (-p0 + p2) * t
                + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2
                + (-p0 + 3 * p1 - 3 * p2 + p3) * t3
            )
            out.append(Vector(v))
    out.append(Vector(pts[-1]))
    return out


def strip(name, ctrl, width, thick):
    pts = catmull(ctrl, 12)
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    verts, faces = [], []
    n = len(pts)
    for i in range(n):
        a = pts[max(0, i - 1)]
        b = pts[min(n - 1, i + 1)]
        tangent = b - a
        if tangent.length < 1e-6:
            tangent = Vector((1, 0, 0))
        tangent.normalize()
        up = Vector((0, 0, 1))
        if abs(tangent.dot(up)) > 0.95:
            up = Vector((0, 1, 0))
        side = tangent.cross(up).normalized()
        verts.append(pts[i] + side * (width / 2))
        verts.append(pts[i] - side * (width / 2))
    for i in range(n - 1):
        a = 2 * i
        faces.append((a, a + 1, a + 3, a + 2))
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    solidify = obj.modifiers.new("s", type="SOLIDIFY")
    solidify.thickness = thick
    solidify.offset = 0
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier="s")
    return obj


def build_ribbon_and_bow():
    satin = bpy.data.materials["Mat_Ribbon_Satin"]

    strap = strip(
        "Box_Ribbon",
        [
            Vector((-2.72, -1.35, 1.05)),
            Vector((-2.55, -1.5, 1.34)),
            Vector((-2.2, -1.3, LID_TOP_Z)),
            Vector((2.2, 1.3, LID_TOP_Z)),
            Vector((2.55, 1.5, 1.34)),
            Vector((2.72, 1.35, 1.05)),
        ],
        RIBBON_W,
        RIBBON_T,
    )
    strap.data.materials.append(satin)

    parts = []

    def loop(mirror):
        s = -1 if mirror else 1
        ctrl = [
            Vector((s * x, y, z))
            for (x, y, z) in [
                (0.02, 0.00, 0.03),
                (0.30, 0.16, 0.17),
                (0.60, 0.12, 0.17),
                (0.72, 0.00, 0.07),
                (0.58, -0.14, 0.03),
                (0.26, -0.10, 0.05),
                (0.02, 0.00, 0.03),
            ]
        ]
        return strip(f"loop_{mirror}", ctrl, 0.28, RIBBON_T)

    parts.append(loop(False))
    parts.append(loop(True))

    def tail(mirror):
        s = -1 if mirror else 1
        ctrl = [
            Vector((s * x, y, z))
            for (x, y, z) in [
                (0.03, -0.02, 0.02),
                (0.10, -0.35, -0.05),
                (0.16, -0.70, -0.12),
                (0.20, -1.02, -0.24),
            ]
        ]
        return strip(f"tail_{mirror}", ctrl, 0.24, RIBBON_T)

    parts.append(tail(False))
    parts.append(tail(True))

    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.10))
    knot = bpy.context.active_object
    knot.name = "knot"
    knot.scale = (0.20, 0.17, 0.24)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    apply_bevel(knot)
    parts.append(knot)

    for o in bpy.data.objects:
        o.select_set(False)
    for p in parts:
        p.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join()
    bow = parts[0]
    bow.name = "Bow"
    bow.data.materials.clear()
    bow.data.materials.append(satin)
    bow.rotation_euler = (0, 0, math.radians(45))
    bow.location = Vector((-2.35, -1.25, LID_TOP_Z + 0.02))

    for name in ("Box_Ribbon", "Bow"):
        obj = bpy.data.objects[name]
        for poly in obj.data.polygons:
            poly.use_smooth = True

    return strap, bow


# ---------------------------------------------------------------------------
# interior: tissue liner + rose blooms + leaves, parented to the base
# ---------------------------------------------------------------------------


def petal_mesh(width, height, cup):
    mesh = bpy.data.meshes.new("petal")
    nu, nv = 5, 6
    verts, faces = [], []
    for iv in range(nv):
        v = iv / (nv - 1)
        halfw = width * 0.5 * (0.20 + 0.80 * math.sin(math.pi * min(v * 1.05, 1.0)))
        for iu in range(nu):
            u = (iu / (nu - 1)) * 2 - 1
            x = u * halfw
            cup_front = -cup * (1 - math.cos(u * math.pi * 0.5))
            tip_back = cup * 0.7 * math.sin(v * math.pi * 0.85)
            y = cup_front + tip_back
            z = v * height
            verts.append((x, y, z))
    for iv in range(nv - 1):
        for iu in range(nu - 1):
            a = iv * nu + iu
            faces.append((a, a + 1, a + nu + 1, a + nu))
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    return mesh


def make_rose(name, loc, scale, mat, seed=0):
    import random

    random.seed(seed)
    petal_template = petal_mesh(0.40, 0.46, 0.22)
    parts = []
    petal_count = 44
    for i in range(petal_count):
        t = i / petal_count
        angle = math.radians(i * 137.5) + random.uniform(-0.05, 0.05)
        r = (0.015 + (t**0.85) * 0.40) * scale
        pz = (0.46 * (1 - t) ** 1.25) * scale
        tilt = math.radians(6 + (t**0.7) * 98) + random.uniform(-0.04, 0.04)
        psc = (0.32 + t * 1.08) * scale
        obj = bpy.data.objects.new(f"{name}_p{i}", petal_template.copy())
        bpy.context.collection.objects.link(obj)
        obj.rotation_euler = (tilt, random.uniform(-0.05, 0.05), angle)
        obj.location = Vector(
            (loc[0] + math.cos(angle) * r, loc[1] + math.sin(angle) * r, loc[2] + pz)
        )
        obj.scale = (psc, psc, psc * 1.05)
        parts.append(obj)
    for o in bpy.data.objects:
        o.select_set(False)
    for p in parts:
        p.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join()
    rose = parts[0]
    rose.name = name
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    rose.data.materials.clear()
    rose.data.materials.append(mat)
    return rose


def build_tissue():
    tissue_mat = bpy.data.materials["Mat_Tissue"]
    nx, ny = 44, 26
    sx, sy = 5.2, 2.9
    verts, faces = [], []
    for j in range(ny):
        for i in range(nx):
            u = i / (nx - 1) - 0.5
            v = j / (ny - 1) - 0.5
            x, y = u * sx, v * sy
            n = noise.noise(Vector((x * 0.8, y * 0.8, 0.0))) + 0.5 * noise.noise(
                Vector((x * 2.1, y * 2.1, 3.0))
            )
            edge = (1 - abs(u) * 2) * (1 - abs(v) * 2)
            z = 0.44 + n * 0.13 * max(0.2, edge) + (1 - max(0.0, edge)) * 0.12
            verts.append((x, y, z))
    for j in range(ny - 1):
        for i in range(nx - 1):
            a = j * nx + i
            faces.append((a, a + 1, a + nx + 1, a + nx))
    mesh = bpy.data.meshes.new("TissueMesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new("Tissue", mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(tissue_mat)
    return obj


def build_interior(base):
    rose_mat = bpy.data.materials["Mat_Rose"]
    rose_mat2 = bpy.data.materials["Mat_Rose2"]
    leaf_mat = bpy.data.materials["Mat_Leaf"]

    tissue = build_tissue()

    roses = []
    placements = [
        ((-1.75, 0.30, 0.74), 0.92, rose_mat),
        ((-0.85, -0.45, 0.72), 1.02, rose_mat2),
        ((0.05, 0.50, 0.76), 0.98, rose_mat),
        ((0.95, -0.30, 0.72), 1.04, rose_mat2),
        ((1.80, 0.35, 0.72), 0.90, rose_mat),
        ((0.55, -0.02, 0.80), 0.86, rose_mat),
        ((-1.15, -0.05, 0.78), 0.80, rose_mat2),
    ]
    for i, (loc, sc, mat) in enumerate(placements):
        roses.append(make_rose(f"rose_{i}", loc, sc, mat, seed=i * 7 + 3))

    leaves = []
    for i, (lx, ly, rot) in enumerate(
        [(-1.35, -0.85, 20), (0.9, 0.9, -30), (1.6, -0.7, 50), (-0.2, -0.9, -10), (1.2, 0.7, 15)]
    ):
        obj = bpy.data.objects.new(f"leaf_{i}", petal_mesh(0.55, 0.8, 0.06))
        bpy.context.collection.objects.link(obj)
        obj.location = Vector((lx, ly, 0.6))
        obj.rotation_euler = (math.radians(72), 0, math.radians(rot))
        obj.data.materials.append(leaf_mat)
        leaves.append(obj)

    for o in bpy.data.objects:
        o.select_set(False)
    for o in roses + leaves + [tissue]:
        o.select_set(True)
    bpy.context.view_layer.objects.active = roses[0]
    bpy.ops.object.join()
    interior = roses[0]
    interior.name = "Interior"
    for poly in interior.data.polygons:
        poly.use_smooth = True

    interior.parent = base
    interior.matrix_parent_inverse = base.matrix_world.inverted()
    return interior


# ---------------------------------------------------------------------------
# lighting, floor, camera (render-test scene only — not exported)
# ---------------------------------------------------------------------------


def build_render_test_scene():
    bpy.ops.mesh.primitive_plane_add(size=20, location=(0, 0, 0))
    floor = bpy.context.active_object
    floor.name = "Floor"
    floor.data.materials.append(bpy.data.materials["Mat_Floor_Marble"])

    def add_directional(name, loc, rot, energy, color):
        light_data = bpy.data.lights.new(name, type="SUN")
        light_data.energy = energy
        light_data.color = color
        light_data.angle = math.radians(4.0)
        obj = bpy.data.objects.new(name, light_data)
        bpy.context.collection.objects.link(obj)
        obj.location = loc
        obj.rotation_euler = rot
        return obj

    add_directional(
        "Key_Light", (-4, 6, 3), (math.radians(55), 0, math.radians(-35)), 1.2, (1.0, 0.95, 0.85)
    )
    add_directional(
        "Fill_Light", (6, 3, 2), (math.radians(65), 0, math.radians(60)), 0.5, (0.95, 0.97, 1.0)
    )
    add_directional(
        "Rim_Light", (0, 2.5, -6), (math.radians(-70), 0, math.radians(10)), 0.35, (0.93, 0.95, 1.0)
    )

    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 128
    scene.cycles.use_denoising = True

    world = bpy.data.worlds.new("World")
    scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")
    if bg:
        bg.inputs[0].default_value = (0.07, 0.06, 0.05, 1.0)

    cam_data = bpy.data.cameras.new("Camera")
    cam_data.lens = 58
    cam_obj = bpy.data.objects.new("Camera", cam_data)
    bpy.context.collection.objects.link(cam_obj)
    cam_obj.location = Vector((6.2, -6.8, 4.4))
    target = Vector((0.1, -0.15, 1.15))
    direction = target - cam_obj.location
    cam_obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    scene.camera = cam_obj

    scene.render.resolution_x = 1600
    scene.render.resolution_y = 1200


# ---------------------------------------------------------------------------
# export
# ---------------------------------------------------------------------------

EXPORT_NAMES = ["Box_Body", "Interior", "Box_Lid", "Logo_Mark", "Box_Ribbon", "Bow"]


def export_glb(lid):
    lid.rotation_euler = (0, 0, 0)  # closed pose for the shipped asset
    os.makedirs(os.path.dirname(GLB_EXPORT_PATH), exist_ok=True)

    for o in bpy.data.objects:
        o.select_set(o.name in EXPORT_NAMES)

    bpy.ops.export_scene.gltf(
        filepath=GLB_EXPORT_PATH,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6,
        export_yup=True,
    )


def save_blend():
    os.makedirs(BLENDER_DIR, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=BLEND_SAVE_PATH)


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------


def main():
    reset_scene()
    build_materials()
    base, lid = build_body_and_lid()
    build_logo(lid)
    build_ribbon_and_bow()
    build_interior(base)
    build_render_test_scene()

    export_glb(lid)
    save_blend()

    size_kb = round(os.path.getsize(GLB_EXPORT_PATH) / 1024, 1)
    total_polys = sum(
        len(bpy.data.objects[n].data.polygons)
        for n in EXPORT_NAMES
        if bpy.data.objects[n].type == "MESH"
    )
    print(f"[build_box] exported {GLB_EXPORT_PATH} ({size_kb} KB, {total_polys} polys)")
    print(f"[build_box] saved {BLEND_SAVE_PATH}")


if __name__ == "__main__":
    main()
