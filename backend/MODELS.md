## 1. Yleiskuva

Sovellus tallentaa käyttäjän salitreenin, uudet liikkeet ja 
oman saliohjelman halutessasi. Tallennetuista treeneistä voi 
myöhemmin tehdä graafeja ja nähdä kalenterinäkymän treenatuista 
päivistä.

Kannasta löytyy oletusliikkeitä ja muutama valmis ohjelmapohja, 
jotka syötetään seed.js-skriptillä.

Data tallennetaan MongoDB:n neljään kokoelmaan (users, moves, 
trainingprograms, trainingsessions) REST API -pyyntöjen kautta.

## 2. Kokoelmat vs. sisäkkäiset dokumentit

Move, User, TrainingProgram ja TrainingSession ovat omia 
kokoelmiaan, koska ne ovat olemassa itsenäisesti. Esimerkiksi 
sama liike (Move) voi esiintyä monessa ohjelmassa ja sessiossa, 
ja käyttäjä (User) voi olla olemassa ennen kuin mitään sessioita 
on tallennettu.

Exercises ja sets eivät ole omia kokoelmiaan vaan sisäkkäin 
TrainingSessionin sisällä. Ne eivät ole itsenäisiä — yksittäinen 
setti (esim. 10 toistoa 60 kilolla) ei tarkoita mitään ilman sitä 
liikettä ja sessiota johon se kuuluu.

Sääntö: jos asia on olemassa itsenäisesti, se saa oman kokoelman 
ja siihen viitataan (`ref`). Jos asia on olemassa vain toisen 
osana, se on sisäkkäin.

## 3. Move-malli

Move-mallissa on kuusi kenttää: name, type, muscle_group, 
image_url, isDefault ja createdBy.

**isDefault ja createdBy** erottavat oletusliikkeet käyttäjien 
omista liikkeistä:
- Oletusliikkeet: `isDefault: true`, `createdBy: null`. 
  Niitä ei voi muokata eikä poistaa — tämä suojaa seed-datan.
- Käyttäjän omat liikkeet: `isDefault: false`, `createdBy: <userId>`.

**name on unique**, koska samannimisiä liikkeitä ei saa olla 
kahta. Kaksi "Penkkipunnerrus"-liikettä sekoittaisivat esimerkiksi 
kehityskäyrän graafin — sessioiden viittaukset jakautuisivat 
kahteen eri liikkeeseen vaikka käyttäjän näkökulmasta kyse on 
samasta.

## 4. User-malli

User-mallissa on kuusi kenttää: name, email, level, exp, 
weightUnit ja trainingPrograms.

**email** on `unique` ja `lowercase`. Lowercase on tärkeä yhdessä 
uniquen kanssa: ilman sitä MongoDB sallisi kaksi rekisteröitymistä 
eri kirjainkoolla (esim. Matti@example.com ja matti@example.com), 
vaikka oikeassa maailmassa ne ovat sama sähköposti.

**weightUnit** (kg tai lbs) on käyttäjäkohtainen eikä sessio- tai 
liikekohtainen. Näin käyttäjä asettaa yksikön kerran, eikä sitä 
tarvitse valita jokaisen treenin yhteydessä. Sessioissa paino 
tallennetaan aina pelkkänä numerona — weightUnit määrää vain 
miten se näytetään käyttäjälle.

**trainingPrograms** on lista viittauksia TrainingProgram-olioihin. 
Tämä toteuttaa User ↔ TrainingProgram moneen-moneen -suhteen: 
käyttäjällä voi olla monta ohjelmaa, ja sama ohjelma voi olla 
monella käyttäjällä.

## 5. TrainingProgram-malli

Mallissa on viisi kenttää: name, description, moves, isDefault 
ja createdBy.

**moves on lista viittauksia** (`ref: 'Move'`) eikä sisäkkäisiä 
liike-olioita. Syy on kaksiosainen:
- Move on itsenäinen malli — sama liike esiintyy monessa ohjelmassa.
- Jos liikkeen nimi tai muu tieto muuttuu, muutos halutaan näkyväksi 
  kaikkialla automaattisesti. Sisäkkäin kopiot pitäisi päivittää 
  jokaisessa ohjelmassa erikseen.

**isDefault ja createdBy** toimivat samalla logiikalla kuin 
Move-mallissa. Oletusohjelmia (`isDefault: true`) ei voi poistaa 
eikä muokata — tämä suojaa seed-datan. Käyttäjän itse luomat 
ohjelmat (`createdBy: <userId>`) ovat täysin muokattavissa.

## 6. TrainingSession-malli

Tiedostossa on kolme skeemaa:
- setSchema (toistot + paino)
- exerciseSchema (viittaus liikkeeseen + lista settejä)
- trainingSessionSchema (käyttäjä, päivämäärä, lista liikkeitä)

Vain trainingSessionSchema rekisteröidään Mongoose-malliksi. 
Kaksi muuta ovat apuskeemoja jotka elävät sisäkkäin sen sisällä.

**`_id: false`** on asetettu setSchema:lle ja exerciseSchema:lle. 
Normaalisti MongoDB luo jokaiselle alidokumentille oman _id:n, 
mutta näille se on turha — yksittäistä settiä ei koskaan haeta, 
päivitetä tai viitata erikseen. Se on aina osa sessiota.

**Validaatiot** varmistavat että sessiossa on vähintään yksi liike 
ja jokaisella liikkeellä vähintään yksi setti. Tyhjien sessioiden 
tallentaminen is not cool.