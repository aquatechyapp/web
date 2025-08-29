import * as z from 'zod';

import { defaultSchemas } from './defaultSchemas';

const { address, city, email, name, notes, phone, state, zipCode } = defaultSchemas;

export const clientSchema = z.object({
  clientAddress: address,
  clientCity: city,
  email: email,
  secondaryEmail: email.optional(),
  firstName: name,
  lastName: name,
  clientNotes: notes,
  phone: phone,
  clientState: state,
  clientZip: zipCode
});
