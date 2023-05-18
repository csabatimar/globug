export default function PaymentValidationService() {
  const EMAIL_PATTERN: RegExp = new RegExp(
    '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@' +
    '[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'
  );
  const MIN_AMOUNT: number = 10;
  const MAX_AMOUNT: number = 500;

  function isAmountLesserThanMaximum(value: number) {
    return value <= MAX_AMOUNT;
  }

  function isAmountGreaterThanMinimum(value: number) {
    return value >= MIN_AMOUNT;
  }

  function isValidAmount(amount: string): boolean {
    let isValid = false;

    try {
      const value: number = Number(amount);
      isValid =
        isAmountGreaterThanMinimum(value) &&
        isAmountLesserThanMaximum(value);
    } catch (e) {
      console.error('Unable to convert amount to number');
    }

    return isValid;
  }

  function isValidEmail(email: string): boolean {
    return EMAIL_PATTERN.test(email);
  }

  return {
    isValidAmount,
    isValidEmail
  }
}
