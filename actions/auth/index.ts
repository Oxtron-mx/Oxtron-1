'use server'
import {auth, signIn, signOut} from '@/auth'
import {ComboRole, forgotPasswordProps, IUser, updatePasswordProps} from '@/constants/types'
import axiosInstance from '@/lib/axios-instance'
import {UpdateUser, UserRegister, UserRegisterByCompanyId} from '@/lib/validation'
import {AxiosError} from 'axios'

export async function login({ email, password }: { email: string; password: string }) {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.error("Login error:", result.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
}

export async function register(user: UserRegister) {
  try {
    const session = await auth()
    const idUserControl: number = Number(session?.user?.id) ?? 0

    if (idUserControl === 0) return

    const { confirmPassword, ...data } = user

    const response = await axiosInstance.post('/UsersControl/Registrar_Usuarios', '', {
      params: {
        ...data
      },
    })

    return { status: response.status, success: true, data: response.data }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function registerByCompanyId(user: UserRegisterByCompanyId) {
  try {
    const session = await auth()
    const idUserControl: number = Number(session?.user?.id) ?? 0

    if (idUserControl === 0) return

    const { confirmPassword, ...data } = user

    const response = await axiosInstance.post('/UsersControl/Registrar_Usuarios_ByCompany', '', {
      params: {
        ...data
      },
    })

    return { status: response.status, success: true, data: response.data }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function updateUser (user: UpdateUser) {
  try {
    const session = await auth()
    const idUserControl: number = Number(session?.user?.id) ?? 0

    if (idUserControl === 0) return

    const response = await axiosInstance.put('/UsersControl/Actualizar_Usuarios', {
      idUSerControl: user.idUSerControl,
      idCompany: user.idCompany,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      email: user.email,
      password: user.password,
      active: user.active,
      idUSerType: user.idUSerType,
      telephoneUser: user.telephoneUser,
      timeZone: user.timeZone,
      language: user.language,
    })

    return { status: response.status, success: true, data: response.data }
  } catch (error) {
    const axiosError = error as unknown as AxiosError
    console.log(error)

    return { status: axiosError.status, success: false, data: axiosError.response?.data }
  }
}

export async function deleteUserById(idUser: number) {
  const response = await axiosInstance.delete(`/UsersControl/Eliminar_Usuarios?IdUser=${ idUser }`)

  return { success: true, status: response.status, data: response.data }
}

export async function disableUserById(idUser: number) {
  const response = await axiosInstance.put(`/UsersControl/Suspender_Usuarios?IdUser=${ idUser }`)

  return { success: true, status: response.status, data: response.data }
}

export async function forgotPassword ( {email}: forgotPasswordProps ) {
  try {
    const response = await axiosInstance.get(`/UsersControl/Mostrar_Usuarios_Forget_Pass?email=${email}`);

    // @ts-ignore
    return response.status
  } catch (error) {
      throw error
  }  
}

export async function updatePassword({ email, passwordOld, passwordNew }: updatePasswordProps) {
  try {
    const url = `/UsersControl/NewPass_Usuarios`;
    
    const response = await axiosInstance.post(url, null, {
      params: {
        email,
        passwordOld,
        passwordNew,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
}

export async function getUserBySession(): Promise<IUser> {
  const session = await auth()
  const response = await axiosInstance.get('/UsersControl/Mostrar_Usuarios')
  const users = response.data as IUser[]

  return users.find(user => session?.user?.id === user.idUSerControl.toString()) as IUser
}

export async function logout() {
  await signOut({ redirectTo: '/' })
}

export async function getCboRoles(): Promise<ComboRole[]> {
  const roles = await axiosInstance.get('/cboRoles/Mostrar_cboRoles');
  return roles.data as ComboRole[];
}
