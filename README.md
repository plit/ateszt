# Teszt feladat

## Telepítés
A forráskód letöltése git segítségével:
```bash
git clone 
```
A forráskód mppájába lépés:
```bash
cd ateszt
```
npm modulok telepítése:
```bash
npm install
```
## Szerver indítása
dev szerver indítása mongose segitsegevel:
```bash
npm run dev
```
A szerver debugg módban történő indítása
```bash
npm run debug
```
Ha a forráskódban elhelyezzük a `debugger;` akkor például a chrome://inspect/#devices alatt meg fog jeleni a debugger link és ha azt megnyitjuk akkor meg fog állni a forráskódban lévő debuggernél.
Az indításkor kiírja, hogy hol lehet figyelni a debuggerre.

## Komunikáció
A komunikáció http protokolon történik a kliens és a backend között

#### Header:
`Content-Type`:`application/json`

`auth_token`: login folyamat végén kapja meg a kliens a tokent ;s azt a tokent kell beállítani, hogy autentikálva legyen a következő kérés is

### Végpontok
url felépítése: `http://[HOST]:[PORT]/api/[EGYÉB...]` pl.: http://localhost:3000/api/user/0/login
#### CRUD
Autentikáció szükséges a crudon keresztül történő komunikációhoz (kivételeket lent lehet megtaálni).

A felépítése az `api/models` alatt van

> Recordok/record lekérdezés (Read)

method: `GET` 

url: `api/[NEV]/[ID]`
- a név kötelező (model név)
- az id opcionálni, ha meg van adva akkor csak azt az egy rekordot adja vissza

__válasz__:

ha nincs megadva id akkor:
```
{
  count: 12,
  data: [....]
}
```
ha van id akkor:
```
{
  data: {...}
}
```


> Új record létrehozása (Create)


method: `POST` 

url: `api/[NEV]`
- a név kötelező

__válasz__:

```
{
   success: true,
   data: {...}
}
```

> Meglévő rekord adatainak a módosítása (Update)

method: `PUT` 

url: `api/[NEVE]/[ID]`
- a név kötelező
- az id is köelező
__válasz__:

```
{
   success: true,
}
```

> Meglévő rekordtörlése (Delete)

method: `DELETE` 

url: `api/[NEVE]/[ID]`
- a név kötelező
- az id is köelező
__válasz__:

```
{
   success: true,
}

```

Ha hiba történik akkor minden esetben igy néz ki a válasz:

```
{
    error: err.message,
}
```
#### Kivételek 
Nem kell autentikáció

Az összes felhasználót lekérdezi: `GET` `api/user/0/all`

Bejelentkezés `POST` `api/user/0/login` 
````json
{
	"email": "plit2@c2.hu",
	"password_hash": "asd"
}
````
`password_hash` - a kliens oldalon történik a jelszó átalakítása ez biztonségi szmpont végett javasolt

Új felhasználó létrehozása: `POST` `api/user/0/signup`
````json
{
	"email": "plit234@c2.hu",
	"password_hash": "asd"
}
````

A végpontok tesztelhetőek például `Postman` segítségével.
