import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { expect } from 'vitest';

import InputField from '@/components/InputField';
import { FieldType } from '@/constants/enums';

import { FormProviderMocked } from '../providers/formProviderMocked';

// const InputFieldWrappedWithForm = (type: FieldType) => {
//   const form = useForm({
//     defaultValues: {
//       [type]: ''
//     }
//   });
//   return (
//     <FormProviderMocked form={form}>
//       <InputField form={form} name={type} type={type} />
//     </FormProviderMocked>
//   );
// };

describe.skip('InputField', () => {
  const type = FieldType.Zip;
  const form = useForm({
    defaultValues: {
      zip: ''
    }
  });
  // Object.values(FieldType).map((type) => {
  //   it(`should render input field with type ${type}`, () => {
  //     const wrapper = render(InputFieldWrappedWithForm(type));
  //     expect(wrapper).toMatchSnapshot();
  //   });
  // });
  it.skip('should render input field with type date', () => {
    const wrapper = render(
      <FormProviderMocked form={form}>
        <InputField name={type} type={type} />
      </FormProviderMocked>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
