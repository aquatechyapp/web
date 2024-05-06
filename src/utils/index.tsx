import { Pool } from '../interfaces/Assignments';

// função para colocar ponto antes dos dois últimos dígitos
// Ex.: 123 => 1.23
// Ex.: 123456 => 1234.56
export function insertDot(number: number) {
  const str = number.toString();
  const result = str.slice(0, -2) + '.' + str.slice(-2);
  return parseFloat(result);
}

export function calculateTotalMonthlyOfAllPools(pools: Pool[]) {
  return insertDot(
    pools.reduce(
      (acc, pool) =>
        acc + pool.montlyPayment
          ? parseInt(pool.montlyPayment.toString().replaceAll(/\D/g, ''))
          : 0,
      0
    )
  );
}

export function calculateTotalAssignmentsOfAllPools(pools: Pool[]) {
  return pools.reduce((acc, pool) => acc + pool.services.length, 0);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isEmpty = (val: any) =>
  val == null || !(Object.keys(val) || val).length;
