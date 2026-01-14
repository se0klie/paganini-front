import api from '../axios';

export const contactsService = {
  list: async (correo) => {
    const res = await api.get(`/users/${encodeURIComponent(correo)}/contacts`); // TODO: confirmar URL
    return res.data;
  },

  create: async (correo, contactEmail, alias) => {
    const res = await api.post(`/users/${encodeURIComponent(correo)}/contacts`, {
      correoContact: contactEmail, 
    });
    return res.data;
  },

  remove: async (correo, contactEmail) => {
    const res = await api.delete(
      `/users/${encodeURIComponent(correo)}/contacts/${encodeURIComponent(contactEmail)}`
    );
    return res.data;
  },
};

export default contactsService;
