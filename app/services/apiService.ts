import { Curso } from '../types';

export const loginConBackendReal = async (usuario: string, password: string): Promise<{
  success: boolean;
  cursos?: Curso[];
  error?: string;
}> => {
  try {
    const respuesta = await fetch('/api/login-ucss', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usuario: usuario.trim(),
        password: password.trim(),
      }),
    });

    const datos = await respuesta.json();

    if (respuesta.ok && datos.success) {
      console.log('✅ Login exitoso!');
      console.log(`📚 ${datos.cantidadCursos} cursos encontrados`);
      return {
        success: true,
        cursos: datos.cursos || []
      };
    } else {
      return {
        success: false,
        error: datos.error || 'Credenciales incorrectas o problema de conexión'
      };
    }
  } catch (error) {
    console.error('Error de conexión:', error);
    return {
      success: false,
      error: 'Error de conexión con el servidor'
    };
  }
};