# MMDMaterialExtractor
Simple script generating Unity materials from .pmx files. For each material
it picks shaders based on outline, culling and shadows used to imitate MMD
rendering. You need to import [MMD-Shader-for-Unity](https://github.com/funmaker/MMD-Shader-for-Unity)
into your project before generating materials. This script will lookup .meta
files to properly link shaders to materials.

## Usage

```
generate.js <model> <outputDir> <shaderDir> (opaque|transparent)
```

- **model** - path to mpx model
- **outputDir** - path to output materials
- **shaderDir** - path to MMD Shaders
- **transparent** or **opaque** - whenever use shaders supporting transparency

## Limitations

- script do not detect whenever material requires transparent shaders. Use
  **transparent** option if you are not sure.
- material will either receive and cast shadows or ignore shadows entirely.
  If you need materials that only do one of these things, you'll have to
  write additional shaders. It is possible, but I didn't wanted to double
  number of shaders again.
