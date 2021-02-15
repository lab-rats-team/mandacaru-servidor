const SERVER_AVAILABLE_LANGUAGES = ['pt-BR', 'en']

module.exports = async (req, res, next) => {
	const acceptLanguage = req.headers['accept-language']

	const languagesAcceptances =
		(acceptLanguage || '')
			.split(',')
			.map((langStr) => {
				const [lang, priorityStr] = langStr.trim().split(';')
				const priority = priorityStr ? parseFloat(priorityStr.substr(2)) : 1.0
				return [lang, priority]
			})

	let bestLang = undefined, bestPriority = 0.0
	for (let [lang, priority] of languagesAcceptances) {
		if (SERVER_AVAILABLE_LANGUAGES.includes(lang) && (priority > bestPriority)) {
			bestLang = lang
			bestPriority = priority
		}
	}

	req.language = bestLang || SERVER_AVAILABLE_LANGUAGES[0]
	return next()
}
