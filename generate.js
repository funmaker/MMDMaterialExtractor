const fs = require("fs");
const path = require("path");
const MMDParser = require("mmd-parser");
const yaml = require("yaml");
const Parser = new MMDParser.Parser();

const input = process.argv[2];
const output = process.argv[3];
const shaderDir = process.argv[4];
const opacity = process.argv[5];

if(process.argv.length !== 6 || (opacity !== "opaque" && opacity !== "transparent")) {
    console.log("Usage:\n\tgenerate.js <model> <outputDir> <shaderDir> (opaque|transparent)");
    process.exit(-1);
}

const inputBase = path.parse(input).dir;
const model = fs.readFileSync(input);
const data = Parser.parsePmx(model.buffer);

const fileRef = (file, fileID, type = 3) => ({
    fileID,
    guid: yaml.parse(fs.readFileSync(file.endsWith(".meta") ? file : file + ".meta").toString("utf8")).guid,
    type,
});
const nullFile = () => ({ fileID: 0 });
const fileRelRef = (file, ...args) => file === undefined ? nullFile() : fileRef(path.join(inputBase, file), ...args);
const color = ([r, g, b, a=1]) => ({ r, g, b, a });

const prelude = `%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!21 &2100000
`;

for(let material of data.materials) {
    // if(material.name === "hair03") material.name = "Hair05"; // Fix for YYB Miku Model. The script doesn't handle name collisions.
    const noCull      = !!(material.flag & (1 << 0));
    const castShadow  = !!(material.flag & (1 << 2));
    const recvShadow  = !!(material.flag & (1 << 3));
    const outline     = !!(material.flag & (1 << 4));
    const transparent = opacity === "transparent";

    const shader = `MeshPmdMaterial${outline ? "Outline" : ""}${transparent ? "-Trans" : ""}${noCull ? "-NoCull" : ""}${(castShadow || recvShadow) ? "" : "-NoShadow"}.shader`

    const mat = {
        Material: {
            serializedVersion: 6,
            m_ObjectHideFlags: 0,
            m_CorrespondingSourceObject: { fileID: 0 },
            m_PrefabInstance: { fileID: 0 },
            m_PrefabAsset: { fileID: 0 },
            m_Name: material.name,
            m_Shader: fileRef(path.join(shaderDir, shader), 4800000),
            m_ShaderKeywords: null,
            m_LightmapFlags: 4,
            m_EnableInstancingVariants: 0,
            m_DoubleSidedGI: 0,
            m_CustomRenderQueue: -1,
            stringTagMap: {},
            disabledShaderPasses: [],
            m_SavedProperties: {
                serializedVersion: 3,
                m_TexEnvs: [
                    {
                        _BumpMap: {
                            m_Texture: { fileID: 0 },
                            m_Scale: { x: 1, y: 1 },
                            m_Offset: { x: 0, y: 0 }
                        }
                    },
                    {
                        _DetailAlbedoMap: {
                            m_Texture: { fileID: 0 },
                            m_Scale: { x: 1, y: 1 },
                            m_Offset: { x: 0, y: 0 }
                        }
                    },
                    {
                        _DetailMask: {
                            m_Texture: { fileID: 0 },
                            m_Scale: { x: 1, y: 1 },
                            m_Offset: { x: 0, y: 0 }
                        }
                    },
                    {
                        _DetailNormalMap: {
                            m_Texture: { fileID: 0 },
                            m_Scale: { x: 1, y: 1 },
                            m_Offset: { x: 0, y: 0 }
                        }
                    },
                    {
                        _EmissionMap: {
                            m_Texture: { fileID: 0 },
                            m_Scale: { x: 1, y: 1 },
                            m_Offset: { x: 0, y: 0 }
                        }
                    },
                    {
                        _MainTex: {
                            m_Texture: fileRelRef(data.textures[material.textureIndex], 2800000),
                            m_Scale: { x: 1, y: 1 },
                            m_Offset: { x: 0, y: 0 }
                        }
                    },
                    {
                        _MetallicGlossMap: {
                            m_Texture: { fileID: 0 },
                            m_Scale: { x: 1, y: 1 },
                            m_Offset: { x: 0, y: 0 }
                        }
                    },
                    {
                        _OcclusionMap: {
                            m_Texture: { fileID: 0 },
                            m_Scale: { x: 1, y: 1 },
                            m_Offset: { x: 0, y: 0 }
                        }
                    },
                    {
                        _ParallaxMap: {
                            m_Texture: { fileID: 0 },
                            m_Scale: { x: 1, y: 1 },
                            m_Offset: { x: 0, y: 0 }
                        }
                    },
                    {
                        _SphereAddTex: {
                            m_Texture: material.envFlag === 2 ? fileRelRef(data.textures[material.envTextureIndex], 2800000) : nullFile(),
                            m_Scale: { x: 1, y: 1 },
                            m_Offset: { x: 0, y: 0 }
                        }
                    },
                    {
                        _SphereMulTex: {
                            m_Texture: material.envFlag === 1 ? fileRelRef(data.textures[material.envTextureIndex], 2800000) : nullFile(),
                            m_Scale: { x: 1, y: 1 },
                            m_Offset: { x: 0, y: 0 }
                        }
                    },
                    {
                        _ToonTex: {
                            m_Texture: fileRelRef(data.textures[material.toonIndex], 2800000),
                            m_Scale: { x: 1, y: 1 },
                            m_Offset: { x: 0, y: 0 }
                        }
                    }
                ],
                m_Floats: [
                    { _BumpScale: 1 },
                    { _Cutoff: 0.5 },
                    { _DetailNormalMapScale: 1 },
                    { _DstBlend: 0 },
                    { _GlossMapScale: 1 },
                    { _Glossiness: 0 },
                    { _GlossyReflections: 1 },
                    { _Metallic: 0 },
                    { _Mode: 0 },
                    { _OcclusionStrength: 1 },
                    { _OutlineWidth: material.edgeSize },
                    { _Parallax: 0.02 },
                    { _Shininess: material.shininess },
                    { _SmoothnessTextureChannel: 0 },
                    { _SpecularHighlights: 1 },
                    { _SrcBlend: 1 },
                    { _UVSec: 0 },
                    { _ZWrite: 1 }
                ],
                m_Colors: [
                    {
                        _AmbColor: color(material.ambient),
                    },
                    {
                        _Color: color(material.diffuse),
                    },
                    {
                        _EmissionColor: {
                            r: 0,
                            g: 0,
                            b: 0,
                            a: 1
                        }
                    },
                    {
                        _OutlineColor: color(material.edgeColor),
                    },
                    {
                        _SpecularColor: color(material.specular),
                    }
                ]
            }
        }
    };
    
    fs.writeFileSync(path.join(output, `${material.name.replace(/[\*\\\/]/g, "_")}.mat`), prelude + yaml.stringify(mat, { schema: "yaml-1.1" }))
}
