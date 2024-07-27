import * as z from 'zod';

import { defaultSchemas } from './defaultSchemas';

const { address, city, email, name, notes, phone, state, zipCode } = defaultSchemas;

export const clientSchema = z.object({
  clientAddress: address,
  clientCity: city,
  email1: email,
  firstName: name,
  lastName: name,
  clientNotes: notes,
  phone1: phone,
  clientState: state,
  clientZip: zipCode
});
