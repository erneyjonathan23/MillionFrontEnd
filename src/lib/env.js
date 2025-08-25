const required = (key, def = undefined, validate = () => true) => {
  const value = process.env[key] ?? def;
  if (value === undefined || !validate(value)) {
    throw new Error(`[env] Variable inválida o faltante: ${key}`);
  }
  return value;
};

export const ENV = {
  API_BASE_URL: required('REACT_APP_API_BASE_URL', ''),
  NODE_ENV: required('NODE_ENV', 'development', (v) => ['development','production','test'].includes(v))
};
