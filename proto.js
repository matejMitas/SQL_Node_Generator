const fs = require('fs');

const tables = {
	druh 			   : 'druh (druh_id, dodavatel, kvalita, pripravy, louhavani)',
	zeme 			   : 'zeme (zeme_id, nazev, kontinent)',
	oblasti 		   : 'oblasti (zeme_id, oznaceni_oblasti, popis, charakter)',
	druh_ze_zeme 	   : 'druh_ze_zeme (druh_id, zeme_id)',
	varka_ze_zeme 	   : 'varka (varka_id, cena, zbyvajici_mnozstvi, sleva)',
	varka_z_druhu      : 'varka_z_druhu (varka_id, druh_id)',
	odberatel_id	   : 'odberatel (odberatel_id, telefon, email, osloveni, ulice, mesto, psc)',
	fyzicka_osoba	   : 'fyzicka_osoba (odberatel_id, jmeno, prijmeni, osobni_telefon)',
	objednavka		   : 'objednavka (odberatel_id)',
	varka_v_objednavce : 'varka_v_objednavce (objednavka_id, varka_id, mnozstvi)'
}

var cnts = {
	oblasti: 0,
}

const inter = {
	zeme: [1, 195],
	kvalita: [1, 3],
	priprava: [0, 8],
	spanelska: [0, 21986],
	louhovani: [1, 200],
	cmp: [0, 7]
}

const desc = [
	'Krásné velké listy, mnoho bílých tipsů, lehká chuť plná meruněk. Jeden z nejoblíbenějších čínských zelených čajů je pojmenovaný po nejjižnějším ledovci na severní polokouli.',
	'Jako když sedíte na louce. Před vámi potok, za vámi vysoké skály. Nadechnete se… a celým tělem prostoupí vůně svěží trávy a horského vzduchu.',
	'Byli jste někdy v broskvovém sadu? Za teplého odpoledne, když dozrávaly sladké, těžké plody a všude zpívaly cikády? My ano.',
	'Když se řekne Gunpowder, představíme si obvykle zelený čaj stočený do drobných tmavošedých granulek. A teď pozor – podobně vypadá i jeho „Kolega v černém“.',
	'Druhá sklizeň začíná v Assamu obvykle během května. Čaje, které z ní vzejdou, charakterizuje nádherné plné tělo a zaoblená chuť.',
	'Jak se vám líbí kombinace svěží zelené a tmavě žluté? Jak se vám líbí sladkost vyšperkovaná svěží kyselkavostí? Jak se vám líbí zelený čaj, papája a vřesové kvítky?',
	'Silná chuť s lehkým kouřovým pohlazením čeká na zvědavé ochutnávače. Zcela nový Gunpowder se v naší nabídce zřejmě dlouho neohřeje.',
	'Připravte si to nejlepší ice tea široko daleko. Nebo použijte čaj Sladká meruňka k prohřátí po podzimní procházce. Nebo mu najděte jiné uplatnění. Vždy si ale buďte jisti, že vás jeho meruňkovo medová kompozice potěší.',
	'Řeklo by se – Matcha. Ale jenom se rozhlédněte, kolik různých variací existuje. Každá chutná jinak, každá byla vyrobena k jinému účelu.'
]

const company_type = [
	's.r.o',
	'A.S.',
	'GmbH',
	'AG',
	'Exports Ltda',
	'Ltda',
	'Ltd',
	'SA'
]

var region_cnt = []
// napln 196 nulama
for (let i=0; i < 197; i++)
	region_cnt[i] = 0;

// pro vazebni tabulku
var used_lands = []
var used_kinds = []

// funkce pro nahodna cisla z intervalu
function rn(interval) {
	const min = interval[0];
	const max = interval[1];
    return Math.floor(Math.random() * (max - min) + min);
}

// nacteme vsechny nutne soubory pro cteni dat
var kinds_json = fs.readFileSync("data/gen_kinds.json", "utf8");
kinds_json = JSON.parse(kinds_json)

var lands_json = fs.readFileSync("data/gen_lands.json", "utf8");
lands_json = JSON.parse(lands_json)

console.log(lands_json.length);

// vycistime soubor
fs.writeFileSync("out.sql", "")

// delka zaznamu (deset zemi, deset oblasti a deset druhu)
var max = 100;
// postupne zapisujeme data
new Promise(function(resolve, reject) {
	console.log(">Generuju super ultra SQL");
	resolve(0); // (*)
}).then(function(i) {
	// vygeneruj druhy
	while (i < max) {
		// vygenerujeme id 
		id = parseInt(rn(inter.spanelska));
		// kdyz tam to id uz je, tak musime vygenerovat nove, muze se stat, 
		// ze tam bude nasobna duplicita
		while (used_kinds.indexOf(id) != -1) {
			id = parseInt(rn(inter.spanelska));
		}
		// pridame validni pouzite id
		used_kinds.push(id)

		var druh_id = kinds_json[id];
		var dodavatel = kinds_json[parseInt(rn(inter.spanelska))] + " " + company_type[parseInt(rn(inter.cmp))];
		var kvalita = rn(inter.kvalita)
		var pripravy = desc[parseInt(rn(inter.priprava))]
		var louhavani = rn(inter.louhovani)

		line = `INSERT INTO ${tables.druh} VALUES('${druh_id}', '${dodavatel}', '${kvalita}', '${pripravy}', '${louhavani}');`;

		fs.appendFileSync("out.sql", line)
		fs.appendFileSync("out.sql", "\n")

		i++;	
	}
	// udelame mezeru mezi polozkama
	fs.appendFileSync("out.sql", "\n")

	return 0;

}).then(function(i) {

	while (i < max) {
		// vygenerujeme id 
		id = parseInt(rn(inter.zeme));

		console.log(`Id zeme: ${id}`);
		// kdyz tam to id uz je, tak musime vygenerovat nove, muze se stat, 
		// ze tam bude nasobna duplicita
		while (used_lands.indexOf(id) != -1) {
			id = parseInt(rn(inter.zeme));
		}
		// pridame validni pouzite id
		used_lands.push(id)
		// nyni vytovrime zemi
		const zeme = lands_json[id];
		// vytvor novou lajnu
		line = `INSERT INTO ${tables.zeme} VALUES('${id}', '${zeme.zeme}', '${zeme.cont}');`;
		// 
		fs.appendFileSync("out.sql", line)
		fs.appendFileSync("out.sql", "\n")

		i++;	
	}

	// udelame mezeru mezi polozkama
	fs.appendFileSync("out.sql", "\n")

	return 0;

}).then(function(i) {

	while (i < max) {
		for (let j = 0; j < parseInt(rn([0, used_lands.length])); j++) {
			id = used_lands[j]
			line = `INSERT INTO ${tables.oblasti} VALUES('${id}', '${i}', '${lands_json[id].cont}', '${desc[parseInt(rn(inter.cmp))]}');`;
			fs.appendFileSync("out.sql", line)
			fs.appendFileSync("out.sql", "\n")
		}

		i++;	
	}

	// udelame mezeru mezi polozkama
	fs.appendFileSync("out.sql", "\n")

	return 0;


}).then(function(i) {

	while (i < max) {
		for (var j = 0; j < parseInt(rn([1, used_kinds.length])); j++) {
			line = `INSERT INTO ${tables.druh_ze_zeme} VALUES('${kinds_json[used_kinds[j]]}','${used_lands[i]}');`;
			fs.appendFileSync("out.sql", line)
			fs.appendFileSync("out.sql", "\n")
		}

		i++;	
	}

}).then(function() {
	console.log(">Vygenerovano a zapsano");
});



