resource_manifest_version '44febabe-d386-4d18-afbe-5e627f4af937'

ui_page "ui/ui.html"

files {
	"ui/ui.html",
	"ui/*.css",
	"ui/*.js",
	"ui/ITEMS/*.png",
	"ui/*.png",
}

server_scripts {
	'@async/async.lua',
	'@mysql-async/lib/MySQL.lua',
	'config.lua',
	'server.lua',
}

client_scripts {
	'config.lua',
	'client.lua'
}

dependencies {
	'mysql-async',
	'async'
}










































description 'MADE BY KOFKOF'
