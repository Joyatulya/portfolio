
export function join_to_string_if_array(input: string | string[]): string {
	return Array.isArray(input) ? input.join(', ') : input;
}
