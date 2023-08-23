export function error(code: string, message: string) {
    const err = new Error(message);
    (err as any).code = code;
    return err;
}
