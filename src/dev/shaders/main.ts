import sunV from './sun/.vert?raw';
import sunF from './sun/.frag?raw';
import sunShineV from './sun/shine.vert?raw';
import sunShineF from './sun/shine.frag?raw';

import { ShaderManager } from '../..';

export const Shader = new ShaderManager({
  sunV,
  sunF,
  sunShineV,
  sunShineF,
});
