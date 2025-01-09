export function capitaliseFirstLetter(text: string) {
	if (!text) {
		return;
	}
	return text[0].toUpperCase() + text.substring(1);
}
