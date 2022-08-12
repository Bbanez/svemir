export class ShaderManager<Shaders extends { [name: string]: string }> {
  constructor(public shaders: Shaders) {}

  load(name: keyof Shaders): string {
    if (!this.shaders[name]) {
      throw Error(`Shader with name "${String(name)}" does not exist.`);
    }
    return this.resolve(this.shaders[name]);
  }

  resolve(shader: string): string {
    let output = `${shader}`;
    for (const _n in this.shaders) {
      const name = _n as keyof Shaders;
      let loop = true;
      while (loop) {
        const buffer = output.replace(`@name`, this.shaders[name]);
        if (buffer === output) {
          loop = false;
        }
        output = buffer;
      }
    }
    return output;
  }
}
