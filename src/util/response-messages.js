const MAX_SAVES = require("../config/max-saves")

exports.FORBIDDEN = {
	'pt-BR': `Acesso proibido`,
	'en': `Forbidden access`,
}

exports.EMAIL_NOT_REGISTERED = {
	'pt-BR': `Este email não está registrado`,
	'en': `This email is not registered`,
}

exports.EMAIL_ALREADY_BEING_USED = {
	'pt-BR': `Este email já está sendo usado`,
	'en': `This email is already being used`,
}

exports.INCORRECT_PASSWORD = {
	'pt-BR': `Senha incorreta`,
	'en': `Incorrect password`,
}

exports.MISSING_ACCESS_TOKEN = {
	'pt-BR': `Faltando token de acesso`,
	'en': `Missing access token`,
}

exports.INVALID_ACCESS_TOKEN = {
	'pt-BR': `Token de acesso inválido`,
	'en': `Invalid access token`,
}

exports.INEXISTENT_PLAYER = {
	'pt-BR': `Jogador inexistente`,
	'en': `Inexistent player`,
}

exports.PLAYER_ID_MUST_BE_A_POSITIVE_INTEGER = {
	'pt-BR': `playerId deve ser um inteiro positivo`,
	'en': `playerId must be a positive integer`,
}

exports.SAVE_ID_MUST_BE_A_POSITIVE_INTEGER = {
	'pt-BR': `saveId deve ser um inteiro positivo`,
	'en': `saveId must be a positive integer`,
}

exports.SAVE_ID_OUT_OF_RANGE = {
	'pt-BR': `saveId fora do alcance (1-${MAX_SAVES})`,
	'en': `saveId out of range (1-${MAX_SAVES})`,
}

exports.FAILED_TO_UPDATE_SAVE = {
	'pt-BR': `Falha ao atualizar save no banco de dados`,
	'en': `Failed to update save in database`,
}

exports.FAILED_TO_ERASE_SAVE = {
	'pt-BR': `Falha ao apagar save no banco de dados`,
	'en': `Failed to erase save in database`,
}

exports.FIELD_HAS_TO_BE_A_STRING = {
	'pt-BR': `{#key} deve ser uma string`,
	'en': `{#key} has to be a string`,
}

exports.FIELD_CANT_BE_EMPTY = {
	'pt-BR': `{#key} não pode ser uma string vazia`,
	'en': `{#key} can't be empty`,
}

exports.FIELD_IS_REQUIRED = {
	'pt-BR': `{#key} é um campo obrigatório`,
	'en': `{#key} is a required field`,
}

exports.INVALID_EMAIL = {
	'pt-BR': `Email inválido`,
	'en': `Invalid email`,
}

exports.PASSWORD_MIN_LENGTH = {
	'pt-BR': `A senha deve conter ao menos {#limit} caracteres`,
	'en': `Password must contain at least {#limit} characters`,
}
