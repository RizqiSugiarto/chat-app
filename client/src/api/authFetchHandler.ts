import { VITE_SERVER_URL } from '@/utils/constants'
import axios, { AxiosRequestConfig } from 'axios'
import toast from 'react-hot-toast'

export default async function authFetchHandler<T>({
    endPoint,
    method,
    data,
}: {
    endPoint: string
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT'
    data: T
}) {
    const url = `${VITE_SERVER_URL}/${endPoint}`

    const token = localStorage.getItem('access-token')

    const options: AxiosRequestConfig<T> = {
        method: method || 'GET',
        data,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    try {
        const response = await axios(url, options)
        return response
    } catch (error) {
        console.log(error)
        toast.error(
            error?.toString() ?? 'Something went wrong please try again later',
            {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            },
        )
    }
}
