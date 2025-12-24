import api from '../axios';

// Servicio de contactos con TODOs para confirmar endpoints y payloads
export const contactsService = {
  // Lista de contactos del usuario
  list: async (correo) => {
    // TODO: Reemplazar por tu endpoint real de listado de contactos
    // Ejemplos posibles:
    // return (await api.get(`/users/${encodeURIComponent(correo)}/contacts`)).data;
    // return (await api.get(`/api/contacts?owner=${encodeURIComponent(correo)}`)).data;
    const res = await api.get(`/users/${encodeURIComponent(correo)}/contacts`); // TODO: confirmar URL
    return res.data;
  },

  // Crear un contacto para el usuario
  create: async (correo, contactEmail, alias) => {
    // TODO: Reemplazar por tu endpoint real y claves exactas del body
    // Ejemplos posibles:
    // await api.post(`/users/${encodeURIComponent(correo)}/contacts`, { email: contactEmail, alias });
    const res = await api.post(`/users/${encodeURIComponent(correo)}/contacts`, {
      contacto: contactEmail, // TODO: si la clave correcta es "email", cámbiala
      alias, // TODO: si tu backend soporta alias
    });
    return res.data;
  },

  // Eliminar un contacto del usuario
  remove: async (correo, contactEmail) => {
    // TODO: Reemplazar por tu endpoint real de eliminación
    // Ejemplos posibles:
    // await api.delete(`/users/${encodeURIComponent(correo)}/contacts/${encodeURIComponent(contactEmail)}`);
    const res = await api.delete(
      `/users/${encodeURIComponent(correo)}/contacts/${encodeURIComponent(contactEmail)}`
    ); // TODO: confirmar URL
    return res.data;
  },
};

export default contactsService;
