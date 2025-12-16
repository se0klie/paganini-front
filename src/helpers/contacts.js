import api from "../axios"
export async function fetchContacts(setContacts) {
    try {
        const response = await api.get(`/users/${localStorage.getItem('correo')}/contacts`)
        if (response.status === 200) {
            setContacts(response.data)
        }
    } catch (err) {
        console.error('GET CONTACTS error', err)
        return err
    }
}