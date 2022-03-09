import sunV from './sun/.vert?raw';
import sunF from './sun/.frag?raw';
import { ShaderManager } from '../..';

export const Shader = new ShaderManager({
  sunV,
  sunF,
});
