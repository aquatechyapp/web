import { maskitoInitialCalibrationPlugin, MaskitoOptions } from '@maskito/core';
import { maskitoNumberOptionsGenerator } from '@maskito/kit';

const { plugins, ...numberOptions } = maskitoNumberOptionsGenerator({
  decimalZeroPadding: true,
  precision: 2,
  decimalSeparator: '.',
  min: 0,
  prefix: '$'
});

export default {
  ...numberOptions,
  plugins: [...plugins, maskitoInitialCalibrationPlugin()]
} as MaskitoOptions;
