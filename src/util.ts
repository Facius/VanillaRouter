/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw#building_an_identity_tag
 */
export const html = (strings: readonly string[] | ArrayLike<string>, ...values: unknown[]) =>
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	String.raw({ raw: strings }, ...values);
