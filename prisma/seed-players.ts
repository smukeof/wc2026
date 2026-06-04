import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Team names must match exactly what's in the Match table
const PLAYERS: [string, string][] = [
  // ===== CZECHY =====
  ['Lucas Hornicek','Czechy'],['Jindrich Stanek','Czechy'],['Matej Kovar','Czechy'],
  ['Vladimir Coufal','Czechy'],['David Doudera','Czechy'],['Tomas Holes','Czechy'],
  ['Robin Hranac','Czechy'],['Stepan Chaloupek','Czechy'],['David Jurasek','Czechy'],
  ['Ladislav Krejci','Czechy'],['Jaroslav Zeleny','Czechy'],['David Zima','Czechy'],
  ['Lukas Cerv','Czechy'],['Vladimir Darida','Czechy'],['Lukas Provod','Czechy'],
  ['Michal Sadilek','Czechy'],['Hugo Sochurek','Czechy'],['Alexandr Sojka','Czechy'],
  ['Tomas Soucek','Czechy'],['Pavel Sulc','Czechy'],['Denis Visinsky','Czechy'],
  ['Adam Hlozek','Czechy'],['Tomas Chory','Czechy'],['Mojmir Chytil','Czechy'],
  ['Jan Kuchta','Czechy'],['Patrik Schick','Czechy'],

  // ===== MEKSYK =====
  ['Raúl Rangel','Meksyk'],['Guillermo Ochoa','Meksyk'],['Carlos Acevedo','Meksyk'],
  ['Jesús Gallardo','Meksyk'],['Johan Vásquez','Meksyk'],['Israel Reyes','Meksyk'],
  ['César Montes','Meksyk'],['Jorge Sánchez','Meksyk'],['Mateo Chávez','Meksyk'],
  ['Edson Álvarez','Meksyk'],['Érik Lira','Meksyk'],['Álvaro Fidalgo','Meksyk'],
  ['Gilberto Mora','Meksyk'],['Brian Gutiérrez','Meksyk'],['Luis Romo','Meksyk'],
  ['Orbelín Pineda','Meksyk'],['Alexis Vega','Meksyk'],['Obed Vargas','Meksyk'],
  ['Luis Chávez','Meksyk'],['Roberto Alvarado','Meksyk'],['Santiago Giménez','Meksyk'],
  ['Raúl Jiménez','Meksyk'],['Julián Quiñones','Meksyk'],['Armando González','Meksyk'],
  ['Guillermo Martínez','Meksyk'],['César Huerta','Meksyk'],

  // ===== RPA =====
  ['Ronwen Williams','RPA'],['Ricardo Goss','RPA'],['Sipho Chaine','RPA'],
  ['Khuliso Mudau','RPA'],['Aubrey Modiba','RPA'],['Khulumani Ndamane','RPA'],
  ['Olwethu Makhanya','RPA'],['Bradley Cross','RPA'],['Thabang Matuludi','RPA'],
  ['Nkosinathi Sibisi','RPA'],['Kamogelo Sebelebele','RPA'],['Ime Okon','RPA'],
  ['Samukele Kabini','RPA'],['Mbekezeli Mbokazi','RPA'],['Teboho Mokoena','RPA'],
  ['Jayden Adams','RPA'],['Thalente Mbatha','RPA'],['Sphephelo Sithole','RPA'],
  ['Oswin Appollis','RPA'],['Tshepang Moremi','RPA'],['Evidence Makgopa','RPA'],
  ['Relebohile Mofokeng','RPA'],['Lyle Foster','RPA'],['Iqraam Rayners','RPA'],
  ['Themba Zwane','RPA'],['Thapelo Maseko','RPA'],

  // ===== KOREA POŁUDNIOWA =====
  ['Jo Hyeon-woo','Korea Południowa'],['Kim Seung-gyu','Korea Południowa'],['Song Bum-keun','Korea Południowa'],
  ['Kim Min-jae','Korea Południowa'],['Cho Yu-min','Korea Południowa'],['Lee Han-beom','Korea Południowa'],
  ['Kim Tae-hyeon','Korea Południowa'],['Park Jin-seob','Korea Południowa'],['Lee Gi-hyuk','Korea Południowa'],
  ['Lee Tae-seok','Korea Południowa'],['Seol Young-woo','Korea Południowa'],['Jens Castrop','Korea Południowa'],
  ['Kim Moon-hwan','Korea Południowa'],['Yang Hyun-jun','Korea Południowa'],['Paik Seung-ho','Korea Południowa'],
  ['Hwang In-beom','Korea Południowa'],['Kim Jin-gyu','Korea Południowa'],['Bae Jun-ho','Korea Południowa'],
  ['Eom Ji-sung','Korea Południowa'],['Lee Dong-gyeong','Korea Południowa'],['Lee Jae-sung','Korea Południowa'],
  ['Lee Kang-in','Korea Południowa'],['Oh Hyeon-gyu','Korea Południowa'],['Son Heung-min','Korea Południowa'],
  ['Cho Gue-sung','Korea Południowa'],['Hwang Hee-chan','Korea Południowa'],

  // ===== BOŚNIA I HERCEGOWINA =====
  ['Nikola Vasilj','Bośnia i Hercegowina'],['Martin Zlomislić','Bośnia i Hercegowina'],['Osman Hadzikić','Bośnia i Hercegowina'],
  ['Sead Kolasinac','Bośnia i Hercegowina'],['Amar Dedić','Bośnia i Hercegowina'],['Nihad Mujakić','Bośnia i Hercegowina'],
  ['Nikola Katić','Bośnia i Hercegowina'],['Tarik Muharemović','Bośnia i Hercegowina'],['Stjepan Radeljić','Bośnia i Hercegowina'],
  ['Dennis Hadzikadunić','Bośnia i Hercegowina'],['Nidal Celik','Bośnia i Hercegowina'],
  ['Amir Hadziahmetović','Bośnia i Hercegowina'],['Ivan Sunjić','Bośnia i Hercegowina'],['Ivan Basić','Bośnia i Hercegowina'],
  ['Dzenis Burnić','Bośnia i Hercegowina'],['Ermin Mahmic','Bośnia i Hercegowina'],['Benjamin Tahirović','Bośnia i Hercegowina'],
  ['Amar Memić','Bośnia i Hercegowina'],['Armin Gigović','Bośnia i Hercegowina'],['Kerim Alajbegović','Bośnia i Hercegowina'],
  ['Esmir Bajraktarević','Bośnia i Hercegowina'],['Ermedin Demirović','Bośnia i Hercegowina'],['Jovo Lukić','Bośnia i Hercegowina'],
  ['Samed Bazdar','Bośnia i Hercegowina'],['Haris Tabaković','Bośnia i Hercegowina'],['Edin Dzeko','Bośnia i Hercegowina'],

  // ===== KANADA =====
  ['Dayne St Clair','Kanada'],['Maxime Crépeau','Kanada'],['Owen Goodman','Kanada'],
  ['Alistair Johnston','Kanada'],['Derek Cornelius','Kanada'],['Richie Laryea','Kanada'],
  ['Niko Sigur','Kanada'],['Joel Waterman','Kanada'],['Luc de Fougerolles','Kanada'],
  ['Moise Bombito','Kanada'],['Alphonso Davies','Kanada'],['Alfie Jones','Kanada'],
  ['Stephen Eustáquio','Kanada'],['Ismaël Koné','Kanada'],['Tajon Buchanan','Kanada'],
  ['Mathieu Choiniere','Kanada'],['Ali Ahmed','Kanada'],['Nathan Saliba','Kanada'],
  ['Liam Millar','Kanada'],['Marcelo Flores','Kanada'],['Jacob Shaffelburg','Kanada'],
  ['Jonathan Osorio','Kanada'],['Jonathan David','Kanada'],['Cyle Larin','Kanada'],
  ['Tani Oluwaseyi','Kanada'],['Promise David','Kanada'],

  // ===== KATAR =====
  ['Mahmud Abunada','Katar'],['Meshaal Barsham','Katar'],['Salah Zakaria','Katar'],
  ['Ayoub Al-Oui','Katar'],['Boualem Khoukhi','Katar'],['Homam Al-Amin','Katar'],
  ['Lucas Mendes','Katar'],['Issa Laye','Katar'],['Pedro Miguel','Katar'],
  ['Al-Hashmi Al-Hussain','Katar'],['Sultan Al-Brake','Katar'],
  ['Assim Madibo','Katar'],['Abdulaziz Hatem','Katar'],['Ahmed Fathy','Katar'],
  ['Karim Boudiaf','Katar'],['Jassem Gaber','Katar'],['Mohamed Al-Mannai','Katar'],
  ['Edmílson Junior','Katar'],['Hasan Al-Haydos','Katar'],['Tahsin Mohammed Jamshid','Katar'],
  ['Ahmed Al-Ganehi','Katar'],['Ahmed Alaaeldin','Katar'],['Akram Afif','Katar'],
  ['Almoez Ali','Katar'],['Mohammed Muntari','Katar'],['Yusuf Abdurisag','Katar'],

  // ===== SZWAJCARIA =====
  ['Marvin Keller','Szwajcaria'],['Gregor Kobel','Szwajcaria'],['Yvon Mvogo','Szwajcaria'],
  ['Manuel Akanji','Szwajcaria'],['Aurele Amenda','Szwajcaria'],['Eray Comert','Szwajcaria'],
  ['Nico Elvedi','Szwajcaria'],['Luca Jaquez','Szwajcaria'],['Miro Muheim','Szwajcaria'],
  ['Ricardo Rodriguez','Szwajcaria'],['Silvan Widmer','Szwajcaria'],
  ['Michel Aebischer','Szwajcaria'],['Zeki Amdouni','Szwajcaria'],['Breel Embolo','Szwajcaria'],
  ['Christian Fassnacht','Szwajcaria'],['Remo Freuler','Szwajcaria'],['Cedric Itten','Szwajcaria'],
  ['Ardon Jashari','Szwajcaria'],['Johan Manzambi','Szwajcaria'],['Dan Ndoye','Szwajcaria'],
  ['Noah Okafor','Szwajcaria'],['Fabian Rieder','Szwajcaria'],['Djibril Sow','Szwajcaria'],
  ['Ruben Vargas','Szwajcaria'],['Granit Xhaka','Szwajcaria'],['Denis Zakaria','Szwajcaria'],

  // ===== BRAZYLIA =====
  ['Alisson','Brazylia'],['Ederson','Brazylia'],['Weverton','Brazylia'],
  ['Alex Sandro','Brazylia'],['Bremer','Brazylia'],['Danilo','Brazylia'],
  ['Douglas Santos','Brazylia'],['Gabriel Magalhães','Brazylia'],['Ibañez','Brazylia'],
  ['Léo Pereira','Brazylia'],['Marquinhos','Brazylia'],['Wesley Franca','Brazylia'],
  ['Bruno Guimarães','Brazylia'],['Casemiro','Brazylia'],['Fabinho','Brazylia'],
  ['Lucas Paquetá','Brazylia'],['Endrick','Brazylia'],['Gabriel Martinelli','Brazylia'],
  ['Igor Thiago','Brazylia'],['Luiz Henrique','Brazylia'],['Matheus Cunha','Brazylia'],
  ['Neymar','Brazylia'],['Raphinha','Brazylia'],['Rayan','Brazylia'],
  ['Vinícius Júnior','Brazylia'],

  // ===== HAITI =====
  ['Johnny Placide','Haiti'],['Alexandre Pierre','Haiti'],['Josue Duverger','Haiti'],
  ['Carlens Arcus','Haiti'],['Wilguens Pauguain','Haiti'],['Duke Lacroix','Haiti'],
  ['Martin Experience','Haiti'],['Jean-Kevin Duverne','Haiti'],['Ricardo Ade','Haiti'],
  ['Hannes Delcroix','Haiti'],['Keeto Thermoncy','Haiti'],
  ['Leverton Pierre','Haiti'],['Carl-Fred Sainthe','Haiti'],['Jean-Jacques Danley','Haiti'],
  ['Jean-Ricner Bellegarde','Haiti'],['Pierre Woodenski','Haiti'],['Dominique Simon','Haiti'],
  ['Louicius Deedson','Haiti'],['Ruben Providence','Haiti'],['Josue Casimir','Haiti'],
  ['Derrick Etienne','Haiti'],['Wilson Isidor','Haiti'],['Duckens Nazon','Haiti'],
  ['Frantzdy Pierrot','Haiti'],['Yassin Fortune','Haiti'],['Lenny Joseph','Haiti'],

  // ===== MAROKO =====
  ['Yassine Bounou','Maroko'],['Munir El Kajoui','Maroko'],['Ahmed Reda Tagnaouti','Maroko'],
  ['Nayef Aguerd','Maroko'],['Youssef Belammari','Maroko'],['Issa Diop','Maroko'],
  ['Zakaria El Ouahdi','Maroko'],['Achraf Hakimi','Maroko'],['Redouane Halhal','Maroko'],
  ['Noussair Mazraoui','Maroko'],['Chadi Riad','Maroko'],['Anass Salah-Eddine','Maroko'],
  ['Sofyan Amrabat','Maroko'],['Ayyoub Bouaddi','Maroko'],['Neil El Aynaoui','Maroko'],
  ['Bilal El Khannouss','Maroko'],['Samir El Mourabet','Maroko'],['Azzedine Ounahi','Maroko'],
  ['Ismael Saibari','Maroko'],['Ayoube Amaimouni','Maroko'],['Brahim Diaz','Maroko'],
  ['Ayoub El Kaabi','Maroko'],['Abdessamad Ezzalzouli','Maroko'],['Yassine Gessime','Maroko'],
  ['Soufiane Rahimi','Maroko'],['Chemsdine Talbi','Maroko'],

  // ===== SZKOCJA =====
  ['Craig Gordon','Szkocja'],['Angus Gunn','Szkocja'],['Liam Kelly','Szkocja'],
  ['Grant Hanley','Szkocja'],['Jack Hendry','Szkocja'],['Aaron Hickey','Szkocja'],
  ['Dominic Hyam','Szkocja'],['Scott McKenna','Szkocja'],['Nathan Patterson','Szkocja'],
  ['Anthony Ralston','Szkocja'],['Andy Robertson','Szkocja'],['John Souttar','Szkocja'],
  ['Kieran Tierney','Szkocja'],['Ryan Christie','Szkocja'],['Findlay Curtis','Szkocja'],
  ['Lewis Ferguson','Szkocja'],['Ben Gannon-Doak','Szkocja'],['John McGinn','Szkocja'],
  ['Kenny McLean','Szkocja'],['Scott McTominay','Szkocja'],
  ['Ché Adams','Szkocja'],['Lyndon Dykes','Szkocja'],['George Hirst','Szkocja'],
  ['Lawrence Shankland','Szkocja'],['Ross Stewart','Szkocja'],

  // ===== AUSTRALIA =====
  ['Patrick Beach','Australia'],['Paul Izzo','Australia'],['Mathew Ryan','Australia'],
  ['Aziz Behich','Australia'],['Jordan Bos','Australia'],['Cameron Burgess','Australia'],
  ['Alessandro Circati','Australia'],['Milos Degenek','Australia'],['Jason Geria','Australia'],
  ['Lucas Herrington','Australia'],['Jacob Italiano','Australia'],['Harry Souttar','Australia'],
  ['Kai Trewin','Australia'],['Cammy Devlin','Australia'],['Ajdin Hrustic','Australia'],
  ['Jackson Irvine','Australia'],['Connor Metcalfe','Australia'],['Paul Okon-Engstler','Australia'],
  ['Aiden O\'Neill','Australia'],['Mathew Leckie','Australia'],['Awer Mabil','Australia'],
  ['Cristian Volpato','Australia'],['Nestory Irankunda','Australia'],['Mohamed Touré','Australia'],
  ['Nishan Velupillay','Australia'],['Tete Yengi','Australia'],

  // ===== PARAGWAJ =====
  ['Orlando Gill','Paragwaj'],['Roberto Fernández','Paragwaj'],['Gastón Olveira','Paragwaj'],
  ['Juan José Cáceres','Paragwaj'],['Gustavo Velázquez','Paragwaj'],['Gustavo Gómez','Paragwaj'],
  ['Júnior Alonso','Paragwaj'],['José Canale','Paragwaj'],['Omar Alderete','Paragwaj'],
  ['Alexandro Maidana','Paragwaj'],['Fabián Balbuena','Paragwaj'],
  ['Diego Gómez','Paragwaj'],['Damián Bobadilla','Paragwaj'],['Braian Ojeda','Paragwaj'],
  ['Andrés Cubas','Paragwaj'],['Matías Galarza','Paragwaj'],['Mauricio Magalhães','Paragwaj'],
  ['Alejandro Romero Gamarra','Paragwaj'],['Gustavo Caballero','Paragwaj'],['Julio Enciso','Paragwaj'],
  ['Ramón Sosa','Paragwaj'],['Álex Arce','Paragwaj'],['Gabriel Ávalos','Paragwaj'],
  ['Isidro Pitta','Paragwaj'],['Miguel Almirón','Paragwaj'],['Antonio Sanabria','Paragwaj'],

  // ===== TURCJA =====
  ['Altay Bayındır','Turcja'],['Mert Günok','Turcja'],['Uğurcan Çakır','Turcja'],
  ['Abdülkerim Bardakcı','Turcja'],['Merih Demiral','Turcja'],['Çağlar Söyüncü','Turcja'],
  ['Eren Elmalı','Turcja'],['Ferdi Kadıoğlu','Turcja'],['Mert Müldür','Turcja'],
  ['Ozan Kabak','Turcja'],['Samet Akaydin','Turcja'],['Zeki Çelik','Turcja'],
  ['Hakan Çalhanoğlu','Turcja'],['İsmail Yüksek','Turcja'],['Kaan Ayhan','Turcja'],
  ['Orkun Kökçü','Turcja'],['Salih Özcan','Turcja'],['Arda Güler','Turcja'],
  ['İrfan Can Kahveci','Turcja'],['Yunus Akgün','Turcja'],
  ['Barış Alper Yılmaz','Turcja'],['Can Uzun','Turcja'],['Deniz Gül','Turcja'],
  ['Kenan Yıldız','Turcja'],['Kerem Aktürkoğlu','Turcja'],['Oğuz Aydın','Turcja'],

  // ===== USA =====
  ['Chris Brady','USA'],['Matt Freese','USA'],['Matt Turner','USA'],
  ['Max Arfsten','USA'],['Sergino Dest','USA'],['Alex Freeman','USA'],
  ['Mark McKenzie','USA'],['Tim Ream','USA'],['Chris Richards','USA'],
  ['Antonee Robinson','USA'],['Miles Robinson','USA'],['Joe Scally','USA'],
  ['Auston Trusty','USA'],['Tyler Adams','USA'],['Sebastian Berhalter','USA'],
  ['Weston McKennie','USA'],['Giovanni Reyna','USA'],['Cristian Roldan','USA'],
  ['Malik Tillman','USA'],['Folarin Balogun','USA'],['Ricardo Pepi','USA'],
  ['Christian Pulisic','USA'],['Timothy Weah','USA'],['Haji Wright','USA'],
  ['Alejandro Zendejas','USA'],

  // ===== CURAÇAO =====
  ['Tyrick Bodak','Curaçao'],['Trevor Doornbusch','Curaçao'],['Eloy Room','Curaçao'],
  ['Riechedly Bazoer','Curaçao'],['Joshua Brenet','Curaçao'],['Roshon van Eijma','Curaçao'],
  ['Sherel Floranus','Curaçao'],['Deveron Fonville','Curaçao'],['Juriën Gaari','Curaçao'],
  ['Armando Obispo','Curaçao'],['Shurandy Sambo','Curaçao'],
  ['Juninho Bacuna','Curaçao'],['Leandro Bacuna','Curaçao'],['Livano Comenencia','Curaçao'],
  ['Kevin Felida','Curaçao'],["Ar'jany Martha",'Curaçao'],['Tyrese Noslin','Curaçao'],
  ['Godfried Roemeratoe','Curaçao'],['Jeremy Antonisse','Curaçao'],['Tahith Chong','Curaçao'],
  ['Kenji Gorré','Curaçao'],['Sontje Hansen','Curaçao'],
  ['Gervane Kastaneer','Curaçao'],['Brandley Kuwas','Curaçao'],['Jürgen Locadia','Curaçao'],
  ['Jearl Margaritha','Curaçao'],

  // ===== EKWADOR =====
  ['Gonzalo Valle','Ekwador'],['Hernán Galíndez','Ekwador'],['Moisés Ramírez','Ekwador'],
  ['Angelo Preciado','Ekwador'],['Félix Torres','Ekwador'],['Joel Ordóñez','Ekwador'],
  ['Jackson Porozo','Ekwador'],['Piero Hincapié','Ekwador'],['Willian Pacho','Ekwador'],
  ['Pervis Estupiñán','Ekwador'],['Yaimar Medina','Ekwador'],
  ['Alan Franco','Ekwador'],['Denil Castillo','Ekwador'],['Moisés Caicedo','Ekwador'],
  ['Jordy Alcívar','Ekwador'],['Anthony Valencia','Ekwador'],['Kendry Páez','Ekwador'],
  ['Pedro Vite','Ekwador'],['Nilson Angulo','Ekwador'],
  ['Alan Minda','Ekwador'],['Gonzalo Plata','Ekwador'],['Enner Valencia','Ekwador'],
  ['Jeremy Arévalo','Ekwador'],['John Yeboah','Ekwador'],['Jordy Caicedo','Ekwador'],
  ['Kevin Rodríguez','Ekwador'],

  // ===== NIEMCY =====
  ['Oliver Baumann','Niemcy'],['Manuel Neuer','Niemcy'],['Alexander Nubel','Niemcy'],
  ['Waldemar Anton','Niemcy'],['Nathaniel Brown','Niemcy'],['Joshua Kimmich','Niemcy'],
  ['David Raum','Niemcy'],['Antonio Rudiger','Niemcy'],['Nico Schlotterbeck','Niemcy'],
  ['Jonathan Tah','Niemcy'],['Malick Thiaw','Niemcy'],
  ['Nadiem Amiri','Niemcy'],['Leon Goretzka','Niemcy'],['Pascal Gross','Niemcy'],
  ['Jamie Leweling','Niemcy'],['Jamal Musiala','Niemcy'],['Felix Nmecha','Niemcy'],
  ['Aleksandar Pavlovic','Niemcy'],['Angelo Stiller','Niemcy'],['Florian Wirtz','Niemcy'],
  ['Maximilian Beier','Niemcy'],['Kai Havertz','Niemcy'],['Lennart Karl','Niemcy'],
  ['Leroy Sane','Niemcy'],['Deniz Undav','Niemcy'],['Nick Woltemade','Niemcy'],

  // ===== WYBRZEŻE KOŚCI SŁONIOWEJ =====
  ['Yahia Fofana','Wybrzeże Kości Słoniowej'],['Mohamed Koné','Wybrzeże Kości Słoniowej'],['Alban Lafont','Wybrzeże Kości Słoniowej'],
  ['Emmanuel Agbadou','Wybrzeże Kości Słoniowej'],['Clement Akpa','Wybrzeże Kości Słoniowej'],['Ousmane Diomande','Wybrzeże Kości Słoniowej'],
  ['Guela Doué','Wybrzeże Kości Słoniowej'],['Ghislain Konan','Wybrzeże Kości Słoniowej'],['Odilon Kossounou','Wybrzeże Kości Słoniowej'],
  ['Evan Ndicka','Wybrzeże Kości Słoniowej'],['Wilfried Singo','Wybrzeże Kości Słoniowej'],
  ['Seko Fofana','Wybrzeże Kości Słoniowej'],['Parfait Guiagon','Wybrzeże Kości Słoniowej'],['Christ Inao Oulai','Wybrzeże Kości Słoniowej'],
  ['Franck Kessié','Wybrzeże Kości Słoniowej'],['Ibrahim Sangare','Wybrzeże Kości Słoniowej'],['Jean-Mickael Seri','Wybrzeże Kości Słoniowej'],
  ['Simon Adingra','Wybrzeże Kości Słoniowej'],['Ange-Yoan Bonny','Wybrzeże Kości Słoniowej'],['Amad Diallo','Wybrzeże Kości Słoniowej'],
  ['Oumar Diakite','Wybrzeże Kości Słoniowej'],['Yan Diomande','Wybrzeże Kości Słoniowej'],['Evann Guessand','Wybrzeże Kości Słoniowej'],
  ['Nicolás Pépé','Wybrzeże Kości Słoniowej'],['Bazoumana Touré','Wybrzeże Kości Słoniowej'],['Elye Wahi','Wybrzeże Kości Słoniowej'],

  // ===== JAPONIA =====
  ['Tomoki Hayakawa','Japonia'],['Keisuke Osako','Japonia'],['Zion Suzuki','Japonia'],
  ['Yuto Nagatomo','Japonia'],['Shogo Taniguchi','Japonia'],['Ko Itakura','Japonia'],
  ['Tsuyoshi Watanabe','Japonia'],['Takehiro Tomiyasu','Japonia'],['Hiroki Ito','Japonia'],
  ['Ayumu Seko','Japonia'],['Yukinari Sugawara','Japonia'],['Junnosuke Suzuki','Japonia'],
  ['Wataru Endo','Japonia'],['Daichi Kamada','Japonia'],['Ritsu Doan','Japonia'],
  ['Ao Tanaka','Japonia'],['Kaishu Sano','Japonia'],
  ['Junya Ito','Japonia'],['Koki Ogawa','Japonia'],['Daizen Maeda','Japonia'],
  ['Ayase Ueda','Japonia'],['Keito Nakamura','Japonia'],['Takefusa Kubo','Japonia'],
  ['Yuito Suzuki','Japonia'],['Kento Shiogai','Japonia'],['Keisuke Goto','Japonia'],

  // ===== HOLANDIA =====
  ['Mark Flekken','Holandia'],['Robin Roefs','Holandia'],['Bart Verbruggen','Holandia'],
  ['Nathan Aké','Holandia'],['Sven Botman','Holandia'],['Denzel Dumfries','Holandia'],
  ['Jorrel Hato','Holandia'],['Jurriën Timber','Holandia'],['Micky van de Ven','Holandia'],
  ['Virgil van Dijk','Holandia'],['Jan Paul van Hecke','Holandia'],['Mats Wieffer','Holandia'],
  ['Frenkie de Jong','Holandia'],['Marten de Roon','Holandia'],['Ryan Gravenberch','Holandia'],
  ['Justin Kluivert','Holandia'],['Teun Koopmeiners','Holandia'],['Tijjani Reijnders','Holandia'],
  ['Guus Til','Holandia'],['Quinten Timber','Holandia'],
  ['Brian Brobbey','Holandia'],['Memphis Depay','Holandia'],['Cody Gakpo','Holandia'],
  ['Noa Lang','Holandia'],['Donyell Malen','Holandia'],['Crysencio Summerville','Holandia'],
  ['Wout Weghorst','Holandia'],

  // ===== SZWECJA =====
  ['Kristoffer Nordfeldt','Szwecja'],['Viktor Johansson','Szwecja'],['Jacob Widell Zetterstrom','Szwecja'],
  ['Gustaf Lagerbielke','Szwecja'],['Victor Lindelof','Szwecja'],['Gabriel Gudmundsson','Szwecja'],
  ['Daniel Svensson','Szwecja'],['Elliot Stroud','Szwecja'],['Carl Starfelt','Szwecja'],
  ['Isak Hien','Szwecja'],['Hjalmar Ekdal','Szwecja'],['Eric Smith','Szwecja'],
  ['Lucas Bergvall','Szwecja'],['Jesper Karlstrom','Szwecja'],['Yasin Ayari','Szwecja'],
  ['Mattias Svanberg','Szwecja'],['Besfort Zeneli','Szwecja'],['Ken Sema','Szwecja'],
  ['Herman Johansson','Szwecja'],
  ['Gustaf Nilsson','Szwecja'],['Benjamin Nygren','Szwecja'],['Anthony Elanga','Szwecja'],
  ['Viktor Gyokeres','Szwecja'],['Taha Ali','Szwecja'],['Alexander Isak','Szwecja'],
  ['Alexander Bernhardsson','Szwecja'],

  // ===== TUNEZJA =====
  ['Aymen Dahmen','Tunezja'],['Sabri Ben Hassine','Tunezja'],['Abdelmouhib Chamakh','Tunezja'],
  ['Montassar Talbi','Tunezja'],['Dylan Bronn','Tunezja'],['Omar Rekik','Tunezja'],
  ['Yan Valery','Tunezja'],['Ali Abdi','Tunezja'],['Moutaz Neffati','Tunezja'],
  ['Raed Chikhaoui','Tunezja'],['Adem Arous','Tunezja'],['Mohamed Ben Hamida','Tunezja'],
  ['Ellyes Skhiri','Tunezja'],['Hannibal Mejbri','Tunezja'],['Anis Ben Slimane','Tunezja'],
  ['Rani Khedira','Tunezja'],['Mohamed Hadj-Mahmoud','Tunezja'],['Mortadha Ben Ouanes','Tunezja'],
  ['Elyes Achouri','Tunezja'],['Ismael Gharbi','Tunezja'],['Elias Saad','Tunezja'],
  ['Sebastian Tounekti','Tunezja'],['Firas Chaouat','Tunezja'],['Khalil Ayari','Tunezja'],
  ['Hazem Mastouri','Tunezja'],['Rayan Elloumi','Tunezja'],

  // ===== BELGIA =====
  ['Thibaut Courtois','Belgia'],['Mike Penders','Belgia'],['Senne Lammens','Belgia'],
  ['Timothy Castagne','Belgia'],['Zeno Debast','Belgia'],['Maxim De Cuyper','Belgia'],
  ['Koni De Winter','Belgia'],['Brandon Mechele','Belgia'],['Thomas Meunier','Belgia'],
  ['Nathan Ngoy','Belgia'],['Joaquin Seys','Belgia'],['Arthur Théate','Belgia'],
  ['Amadou Onana','Belgia'],['Nicolas Raskin','Belgia'],['Axel Witsel','Belgia'],
  ['Youri Tielemans','Belgia'],['Kevin De Bruyne','Belgia'],['Hans Vanaken','Belgia'],
  ['Charles De Ketelaere','Belgia'],['Diego Moreira','Belgia'],
  ['Matias Fernandez-Pardo','Belgia'],['Romelu Lukaku','Belgia'],['Alexis Saelemaekers','Belgia'],
  ['Leandro Trossard','Belgia'],['Jérémy Doku','Belgia'],['Dodi Lukebakio','Belgia'],

  // ===== EGIPT =====
  ['Mohamed El Shenawy','Egipt'],['Mostafa Shobeir','Egipt'],['El Mahdi Soliman','Egipt'],['Mohamed Alaa','Egipt'],
  ['Mohamed Hany','Egipt'],['Tarek Alaa','Egipt'],['Hamdy Fathy','Egipt'],['Rami Rabia','Egipt'],
  ['Yasser Ibrahim','Egipt'],['Hossam Abdelmaguid','Egipt'],['Mohamed Abdelmonemn','Egipt'],
  ['Ahmed Fatouh','Egipt'],['Karim Hafez','Egipt'],
  ['Marwan Otaka','Egipt'],['Mohanad Lasheen','Egipt'],['Nabil Dunga','Egipt'],['Mahmoud Saber','Egipt'],
  ['Ahmed Zizo','Egipt'],['Emam Ashour','Egipt'],['Mostafa Ziko','Egipt'],
  ['Mahmoud Trezeguet','Egipt'],['Ibrahim Adel','Egipt'],['Haissem Hassan','Egipt'],
  ['Omar Marmoush','Egipt'],['Mohamed Salah','Egipt'],['Aqtay Abdallah','Egipt'],

  // ===== IRAN =====
  ['Alireza Beiranvand','Iran'],['Seyed Hossein Hosseini','Iran'],['Payam Niazmand','Iran'],
  ['Shoja Khalilzadeh','Iran'],['Hossein Kanaani','Iran'],['Ali Nemati','Iran'],
  ['Danial Eiri','Iran'],['Ehsan Hajsafi','Iran'],['Milad Mohammadi','Iran'],
  ['Saleh Hardani','Iran'],['Ramin Rezaeian','Iran'],
  ['Saman Ghoddos','Iran'],['Saeed Ezatolahi','Iran'],['Roozbeh Cheshmi','Iran'],
  ['Amirmohammad Razzaghinia','Iran'],['Mohammad Ghorbani','Iran'],['Arya Yousefi','Iran'],
  ['Alireza Jahanbakhsh','Iran'],['Mehdi Torabi','Iran'],
  ['Mehdi Ghayedi','Iran'],['Mohammad Mohebi','Iran'],['Mehdi Taremi','Iran'],
  ['Amirhossein Hosseinzadeh','Iran'],['Dennis Eckert Ayensa','Iran'],['Ali Alipour','Iran'],
  ['Shahriar Moghanlou','Iran'],

  // ===== NOWA ZELANDIA =====
  ['Max Crocombe','Nowa Zelandia'],['Alex Paulsen','Nowa Zelandia'],['Michael Woud','Nowa Zelandia'],
  ['Tyler Bindon','Nowa Zelandia'],['Michael Boxall','Nowa Zelandia'],['Liberato Cacace','Nowa Zelandia'],
  ['Francis de Vries','Nowa Zelandia'],['Callan Elliot','Nowa Zelandia'],['Tim Payne','Nowa Zelandia'],
  ['Nando Pijnaker','Nowa Zelandia'],['Tommy Smith','Nowa Zelandia'],['Finn Surman','Nowa Zelandia'],
  ['Lachlan Bayliss','Nowa Zelandia'],['Joe Bell','Nowa Zelandia'],['Matt Garbett','Nowa Zelandia'],
  ['Ben Old','Nowa Zelandia'],['Alex Rufer','Nowa Zelandia'],['Sarpreet Singh','Nowa Zelandia'],
  ['Marko Stamenic','Nowa Zelandia'],['Ryan Thomas','Nowa Zelandia'],
  ['Kosta Barbarouses','Nowa Zelandia'],['Eli Just','Nowa Zelandia'],['Callum McCowatt','Nowa Zelandia'],
  ['Jesse Randall','Nowa Zelandia'],['Ben Waine','Nowa Zelandia'],['Chris Wood','Nowa Zelandia'],

  // ===== WYSPY ZIELONEGO PRZYLĄDKA =====
  ['Vozinha','Wyspy Zielonego Przylądka'],['Márcio Rosa','Wyspy Zielonego Przylądka'],['Carlos Joaquim dos Santos','Wyspy Zielonego Przylądka'],
  ['Steven Moreira','Wyspy Zielonego Przylądka'],['Wagner Pina','Wyspy Zielonego Przylądka'],['João Paulo Fernandes','Wyspy Zielonego Przylądka'],
  ['Sidny Lopes Cabral','Wyspy Zielonego Przylądka'],['Logan Costa','Wyspy Zielonego Przylądka'],['Roberto Lopes','Wyspy Zielonego Przylądka'],
  ['Kelvin Pires','Wyspy Zielonego Przylądka'],['Stopira','Wyspy Zielonego Przylądka'],['Diney Borges','Wyspy Zielonego Przylądka'],
  ['Jamiro Monteiro','Wyspy Zielonego Przylądka'],['Telmo Arcanjo','Wyspy Zielonego Przylądka'],['Yannick Semedo','Wyspy Zielonego Przylądka'],
  ['Laros Duarte','Wyspy Zielonego Przylądka'],['Deroy Duarte','Wyspy Zielonego Przylądka'],['Kevin Lenini Pina','Wyspy Zielonego Przylądka'],
  ['Ryan Mendes','Wyspy Zielonego Przylądka'],['Willy Semedo','Wyspy Zielonego Przylądka'],['Garry Rodrigues','Wyspy Zielonego Przylądka'],
  ['Jovane Cabral','Wyspy Zielonego Przylądka'],['Hélio Varela','Wyspy Zielonego Przylądka'],
  ['Nuno Da Costa','Wyspy Zielonego Przylądka'],['Dailon Livramento','Wyspy Zielonego Przylądka'],['Gilson Benchimol','Wyspy Zielonego Przylądka'],

  // ===== ARABIA SAUDYJSKA =====
  ['Ahmed Al-Kassar','Arabia Saudyjska'],['Mohammed Al-Owais','Arabia Saudyjska'],['Nawaf Al-Aqidi','Arabia Saudyjska'],
  ['Saud Abdulhamid','Arabia Saudyjska'],['Nawaf Boushal','Arabia Saudyjska'],['Jehad Thakri','Arabia Saudyjska'],
  ['Abdulelah Al-Amri','Arabia Saudyjska'],['Hassan Tambakti','Arabia Saudyjska'],['Ali Lajami','Arabia Saudyjska'],
  ['Hassan Kadesh','Arabia Saudyjska'],['Moteb Al-Harbi','Arabia Saudyjska'],['Ali Majrashi','Arabia Saudyjska'],
  ['Mohammed Abu Al-Shamat','Arabia Saudyjska'],
  ['Ziyad Al-Johani','Arabia Saudyjska'],['Nasser Al-Dawsari','Arabia Saudyjska'],['Mohamed Kanno','Arabia Saudyjska'],
  ['Abdullah Al-Khaibari','Arabia Saudyjska'],['Khalid Al-Ghannam','Arabia Saudyjska'],['Alaa Hejji','Arabia Saudyjska'],
  ['Musab Al-Juwayr','Arabia Saudyjska'],['Ayman Yahya','Arabia Saudyjska'],
  ['Abdullah Al-Hamdan','Arabia Saudyjska'],['Sultan Mandash','Arabia Saudyjska'],['Salem Al-Dawsari','Arabia Saudyjska'],
  ['Firas Al-Buraikan','Arabia Saudyjska'],['Saleh Al-Shehri','Arabia Saudyjska'],

  // ===== HISZPANIA =====
  ['Unai Simón','Hiszpania'],['David Raya','Hiszpania'],['Joan García','Hiszpania'],
  ['Marc Cucurella','Hiszpania'],['Alejandro Grimaldo','Hiszpania'],['Pau Cubarsí','Hiszpania'],
  ['Aymeric Laporte','Hiszpania'],['Marc Pubill','Hiszpania'],['Eric García','Hiszpania'],
  ['Marcos Llorente','Hiszpania'],['Pedro Porro','Hiszpania'],
  ['Pedri','Hiszpania'],['Fabián Ruiz','Hiszpania'],['Martin Zubimendi','Hiszpania'],
  ['Gavi','Hiszpania'],['Rodri','Hiszpania'],['Álex Baena','Hiszpania'],['Mikel Merino','Hiszpania'],
  ['Mikel Oyarzabal','Hiszpania'],['Dani Olmo','Hiszpania'],['Nico Williams','Hiszpania'],
  ['Yeremy Pino','Hiszpania'],['Ferran Torrés','Hiszpania'],['Borja Iglesias','Hiszpania'],
  ['Víctor Muñoz','Hiszpania'],['Lamine Yamal','Hiszpania'],

  // ===== URUGWAJ =====
  ['Sergio Rochet','Urugwaj'],['Fernando Muslera','Urugwaj'],['Santiago Mele','Urugwaj'],
  ['Guillermo Varela','Urugwaj'],['Ronald Araujo','Urugwaj'],['Jose Maria Gimenez','Urugwaj'],
  ['Santiago Bueno','Urugwaj'],['Sebastian Caceres','Urugwaj'],['Mathias Olivera','Urugwaj'],
  ['Joaquín Piquerez','Urugwaj'],['Matias Vina','Urugwaj'],
  ['Manuel Ugarte','Urugwaj'],['Emiliano Martinez','Urugwaj'],['Rodrigo Bentancur','Urugwaj'],
  ['Federico Valverde','Urugwaj'],['Agustin Canobbio','Urugwaj'],['Juan Manuel Sanabria','Urugwaj'],
  ['Giorgan de Arrascaeta','Urugwaj'],['Nicolas de la Cruz','Urugwaj'],['Rodrigo Zalazar','Urugwaj'],
  ['Facundo Pellistri','Urugwaj'],['Maximiliano Araujo','Urugwaj'],['Brian Rodriguez','Urugwaj'],
  ['Rodrigo Aguirre','Urugwaj'],['Federico Vinas','Urugwaj'],['Darwin Nunez','Urugwaj'],

  // ===== FRANCJA =====
  ['Mike Maignan','Francja'],['Robin Risser','Francja'],['Brice Samba','Francja'],
  ['Lucas Digne','Francja'],['Malo Gusto','Francja'],['Lucas Hernandez','Francja'],
  ['Théo Hernandez','Francja'],['Ibrahima Konaté','Francja'],['Jules Koundé','Francja'],
  ['Maxence Lacroix','Francja'],['William Saliba','Francja'],['Dayot Upamecano','Francja'],
  ["N'Golo Kanté",'Francja'],['Manu Koné','Francja'],['Adrien Rabiot','Francja'],
  ['Aurélien Tchouaméni','Francja'],['Warren Zaïre-Emery','Francja'],
  ['Maghnes Akliouche','Francja'],['Bradley Barcola','Francja'],['Rayan Cherki','Francja'],
  ['Ousmane Dembélé','Francja'],['Désiré Doué','Francja'],['Jean-Philippe Mateta','Francja'],
  ['Kylian Mbappé','Francja'],['Michael Olise','Francja'],['Marcus Thuram','Francja'],

  // ===== IRAK =====
  ['Fahad Talib','Irak'],['Jalal Hassan','Irak'],['Ahmed Basil Fadhil','Irak'],
  ['Hussein Ali','Irak'],['Manaf Younis','Irak'],['Zaid Tahseen','Irak'],
  ['Rebin Sulaka','Irak'],['Frans Dhia Putros','Irak'],['Akam Hashem','Irak'],
  ['Merchas Doski','Irak'],['Ahmed Yahya','Irak'],
  ['Zaid Ismail','Irak'],['Amir Al-Ammari','Irak'],['Kevin Yakob','Irak'],
  ['Zidane Iqbal','Irak'],['Aimar Sher','Irak'],['Mustafa Saadoon','Irak'],
  ['Youssef Amyn','Irak'],['Ibrahim Bayesh','Irak'],['Ahmed Qasem','Irak'],['Ali Jasim','Irak'],
  ['Marko Farji','Irak'],['Ali Al-Hamadi','Irak'],['Ali Yousif','Irak'],
  ['Aymen Hussein','Irak'],['Mohanad Ali','Irak'],

  // ===== NORWEGIA =====
  ['Egil Selvik','Norwegia'],['Orjan Nyland','Norwegia'],['Sander Tangvik','Norwegia'],
  ['Kristoffer Ajer','Norwegia'],['Fredrik Bjorkan','Norwegia'],['Henrik Falchener','Norwegia'],
  ['Sondre Langas','Norwegia'],['Torbjorn Heggem','Norwegia'],['Marcus Pedersen','Norwegia'],
  ['Julian Ryerson','Norwegia'],['David Moller Wolfe','Norwegia'],['Leo Ostigard','Norwegia'],
  ['Thelo Aasgaard','Norwegia'],['Fredrik Aursnes','Norwegia'],['Patrick Berg','Norwegia'],
  ['Sander Berge','Norwegia'],['Oscar Bobb','Norwegia'],['Jens Petter Hauge','Norwegia'],
  ['Antonio Nusa','Norwegia'],['Andreas Schjelderup','Norwegia'],['Morten Thorsby','Norwegia'],
  ['Kristian Thorstvedt','Norwegia'],['Martin Odegaard','Norwegia'],
  ['Erling Haaland','Norwegia'],['Jorgen Strand Larsen','Norwegia'],['Alexander Sorloth','Norwegia'],

  // ===== SENEGAL =====
  ['Edouard Mendy','Senegal'],['Yehvann Diouf','Senegal'],['Mory Diaw','Senegal'],
  ['Krepin Diatta','Senegal'],['Antoine Mendy','Senegal'],['Abdoulaye Seck','Senegal'],
  ['Kalidou Koulibaly','Senegal'],['Ilay Camara','Senegal'],['Moussa Niakhate','Senegal'],
  ['Mamadou Sarr','Senegal'],['El-Hadji Malick Diouf','Senegal'],['Moustapha Mbow','Senegal'],
  ['Ismail Jakobs','Senegal'],
  ['Idrissa Gueye','Senegal'],['Habib Diarra','Senegal'],['Pape Matar Sarr','Senegal'],
  ['Pape Gueye','Senegal'],['Lamine Camara','Senegal'],['Pathe Ciss','Senegal'],['Bara Ndiaye','Senegal'],
  ['Sadio Mane','Senegal'],['Bamba Dieng','Senegal'],['Iliman Ndiaye','Senegal'],
  ['Nicolas Jackson','Senegal'],['Assane Diao','Senegal'],['Ismaila Sarr','Senegal'],

  // ===== ALGIERIA =====
  ['Luca Zidane','Algieria'],['Oussama Benbout','Algieria'],['Melvin Mastil','Algieria'],['Abdellatif Ramdane','Algieria'],
  ['Rafik Belghali','Algieria'],['Samir Chergui','Algieria'],["Rayan Aït-Nouri",'Algieria'],
  ['Jaouen Hadjam','Algieria'],["Aïssa Mandi",'Algieria'],['Ramy Bensebaini','Algieria'],
  ['Zineddine Belaid','Algieria'],['Achref Abada','Algieria'],['Mohamed Amine Tougai','Algieria'],
  ['Nabil Bentaleb','Algieria'],['Hicham Boudaoui','Algieria'],['Houssem Aouar','Algieria'],
  ["Farès Chaïbi",'Algieria'],['Ibrahim Maza','Algieria'],['Yassine Titraoui','Algieria'],
  ['Ramiz Zerrouki','Algieria'],["Farès Ghedjemis",'Algieria'],['Riyad Mahrez','Algieria'],
  ['Adil Boulbina','Algieria'],['Mohamed Amoura','Algieria'],['Nadhir Benbouali','Algieria'],
  ['Amine Gouiri','Algieria'],['Anis Hadj Moussa','Algieria'],

  // ===== ARGENTYNA =====
  ['Emiliano Martínez','Argentyna'],['Gerónimo Rulli','Argentyna'],['Juan Musso','Argentyna'],
  ['Gonzalo Montiel','Argentyna'],['Nahuel Molina','Argentyna'],['Nicolás Otamendi','Argentyna'],
  ['Cristian Romero','Argentyna'],['Leonardo Balerdi','Argentyna'],['Lisandro Martínez','Argentyna'],
  ['Nicolás Tagliafico','Argentyna'],['Facundo Medina','Argentyna'],
  ['Valentín Barco','Argentyna'],['Giovani Lo Celso','Argentyna'],['Nico Paz','Argentyna'],
  ['Enzo Fernández','Argentyna'],['Leandro Paredes','Argentyna'],['Alexis Mac Allister','Argentyna'],
  ['Rodrigo De Paul','Argentyna'],['Exequiel Palacios','Argentyna'],['Nicolás González','Argentyna'],
  ['Giuliano Simeone','Argentyna'],['Thiago Almada','Argentyna'],
  ['Lionel Messi','Argentyna'],['Julián Álvarez','Argentyna'],['Lautaro Martínez','Argentyna'],
  ['Flaco López','Argentyna'],

  // ===== AUSTRIA =====
  ['Alexander Schlager','Austria'],['Florian Wiegele','Austria'],['Patrick Pentz','Austria'],
  ['David Affengruber','Austria'],['Kevin Danso','Austria'],['Stefan Posch','Austria'],
  ['David Alaba','Austria'],['Philipp Lienhart','Austria'],['Phillipp Mwene','Austria'],
  ['Marco Friedl','Austria'],['Alexander Prass','Austria'],['Michael Svoboda','Austria'],
  ['Xaver Schlager','Austria'],['Nicolas Seiwald','Austria'],['Marcel Sabitzer','Austria'],
  ['Florian Grillitsch','Austria'],['Carney Chukwuemeka','Austria'],['Romano Schmid','Austria'],
  ['Christoph Baumgartner','Austria'],['Konrad Laimer','Austria'],['Patrick Wimmer','Austria'],
  ['Paul Wanner','Austria'],["Alessandro Schöpf",'Austria'],
  ['Marko Arnautović','Austria'],['Michael Gregoritsch','Austria'],['Sasa Kalajdzić','Austria'],

  // ===== JORDANIA =====
  ['Yazeed Abulaila','Jordania'],['Abdallah Al-Fakhouri','Jordania'],['Noureddin Bani Attiah','Jordania'],
  ['Abdallah Nasib','Jordania'],['Saed Al-Rosan','Jordania'],['Yazan Al-Arab','Jordania'],
  ['Saleem Obaid','Jordania'],['Mohammad Abualnadi','Jordania'],['Husam Abu Dahab','Jordania'],
  ['Ehsan Haddad','Jordania'],['Anas Badawi','Jordania'],['Mohannad Abu Taha','Jordania'],
  ['Mohammad Abu Hasheesh','Jordania'],
  ['Noor Al-Rawabdeh','Jordania'],['Nizar Al-Rashdan','Jordania'],['Ibrahim Saadeh','Jordania'],
  ['Rajaei Ayed','Jordania'],['Amer Jamous','Jordania'],['Mohammad Al-Dawoud','Jordania'],
  ['Mahmoud Al-Mardi','Jordania'],['Odeh Fakhoury','Jordania'],['Mousa Tamari','Jordania'],
  ['Mohammad Abu Zrayq','Jordania'],['Ali Azaizeh','Jordania'],['Ibrahim Sabra','Jordania'],
  ['Ali Olwan','Jordania'],

  // ===== KOLUMBIA =====
  ['Camilo Vargas','Kolumbia'],['Álvaro Montero','Kolumbia'],['David Ospina','Kolumbia'],
  ['Dávinson Sánchez','Kolumbia'],['Jhon Lucumí','Kolumbia'],['Yerry Mina','Kolumbia'],
  ['Willer Ditta','Kolumbia'],['Daniel Muñoz','Kolumbia'],['Santiago Arias','Kolumbia'],
  ['Johan Mojica','Kolumbia'],['Deiver Machado','Kolumbia'],
  ['Richard Rios','Kolumbia'],['Jefferson Lerma','Kolumbia'],['Kevin Castaño','Kolumbia'],
  ['Juan Camilo Portilla','Kolumbia'],['Gustavo Puerta','Kolumbia'],['Jhon Arias','Kolumbia'],
  ['Jorge Carrascal','Kolumbia'],['Juan Fernando Quintero','Kolumbia'],['James Rodriguez','Kolumbia'],
  ['Jaminton Campaz','Kolumbia'],
  ['Juan Camilo Hernández','Kolumbia'],['Luis Díaz','Kolumbia'],['Luis Suárez','Kolumbia'],
  ['Carlos Andrés Gómez','Kolumbia'],['Jhon Córdoba','Kolumbia'],

  // ===== DR KONGO =====
  ['Lionel Mpasi-Nzau','DR Kongo'],['Timothy Fayulu','DR Kongo'],['Matthieu Epolo','DR Kongo'],
  ['Chancel Mbemba','DR Kongo'],['Aaron Wan-Bissaka','DR Kongo'],['Axel Tuanzebe','DR Kongo'],
  ['Arthur Masuaku','DR Kongo'],['Joris Kayembe','DR Kongo'],['Steve Kapuadi','DR Kongo'],
  ['Rocky Bushiri','DR Kongo'],['Dylan Batubinsika','DR Kongo'],['Gédéon Kalulu','DR Kongo'],
  ['Noah Sadiki','DR Kongo'],['Samuel Moutoussamy','DR Kongo'],['Edo Kayembe','DR Kongo'],
  ["Ngal'ayel Mukau",'DR Kongo'],['Charles Pickel','DR Kongo'],['Nathanaël Mbuku','DR Kongo'],
  ['Brian Cipenga','DR Kongo'],['Gaël Kakuta','DR Kongo'],['Meschack Elia','DR Kongo'],
  ['Théo Bongonda','DR Kongo'],
  ['Fiston Mayele','DR Kongo'],['Cédric Bakambu','DR Kongo'],['Simon Banza','DR Kongo'],
  ['Yoane Wissa','DR Kongo'],

  // ===== PORTUGALIA =====
  ['Diogo Costa','Portugalia'],['Rui Silva','Portugalia'],['José Sá','Portugalia'],['Ricardo Velho','Portugalia'],
  ['Diogo Dalot','Portugalia'],['Matheus Nunes','Portugalia'],['Nélson Semedo','Portugalia'],
  ['Joao Cancelo','Portugalia'],['Nuno Mendes','Portugalia'],['Gonçalo Inácio','Portugalia'],
  ['Renato Veiga','Portugalia'],['Rúben Dias','Portugalia'],['Tomás Araújo','Portugalia'],
  ['Rúben Neves','Portugalia'],['Samu Costa','Portugalia'],['João Neves','Portugalia'],
  ['Vitinha','Portugalia'],['Bruno Fernandes','Portugalia'],['Bernardo Silva','Portugalia'],
  ['João Félix','Portugalia'],['Trincão','Portugalia'],['Francisco Conceição','Portugalia'],
  ['Pedro Neto','Portugalia'],['Rafael Leão','Portugalia'],['Gonçalo Guedes','Portugalia'],
  ['Gonçalo Ramos','Portugalia'],['Cristiano Ronaldo','Portugalia'],

  // ===== UZBEKISTAN =====
  ['Utkir Yusupov','Uzbekistan'],['Botirali Ergashev','Uzbekistan'],['Abduvokhid Nematov','Uzbekistan'],
  ['Abdukodir Khusanov','Uzbekistan'],['Khozhiakbar Alizhonov','Uzbekistan'],['Farrukh Sayfiev','Uzbekistan'],
  ['Rustam Ashurmatov','Uzbekistan'],['Sherzod Nasrullaev','Uzbekistan'],['Umar Eshmurodov','Uzbekistan'],
  ['Avazbek Ulmasaliev','Uzbekistan'],['Jakhongir Urozov','Uzbekistan'],['Bekhruz Karimov','Uzbekistan'],
  ['Abdulla Abdullaev','Uzbekistan'],
  ['Akmal Mozgovoy','Uzbekistan'],['Otabek Shukurov','Uzbekistan'],['Jamshid Iskanderov','Uzbekistan'],
  ['Odildzhon Khamrobekov','Uzbekistan'],['Jaloliddin Masharipov','Uzbekistan'],['Aziz Ganiev','Uzbekistan'],
  ['Sherzod Esanov','Uzbekistan'],['Abbosbek Fayzullaev','Uzbekistan'],
  ['Eldor Shomurodov','Uzbekistan'],['Igor Sergeev','Uzbekistan'],['Azizbek Amanov','Uzbekistan'],
  ['Oston Urunov','Uzbekistan'],['Dostonbek Khamdamov','Uzbekistan'],

  // ===== CHORWACJA =====
  ['Dominik Livaković','Chorwacja'],['Dominik Kotarski','Chorwacja'],['Ivor Pandur','Chorwacja'],
  ['Josip Stanišić','Chorwacja'],['Kristijan Jakić','Chorwacja'],['Joško Gvardiol','Chorwacja'],
  ['Luka Vušković','Chorwacja'],['Martin Erlić','Chorwacja'],['Duje Ćaleta-Car','Chorwacja'],
  ['Josip Šutalo','Chorwacja'],['Marin Pongračić','Chorwacja'],
  ['Luka Modrić','Chorwacja'],['Mateo Kovačić','Chorwacja'],['Mario Pašalić','Chorwacja'],
  ['Nikola Vlašić','Chorwacja'],['Luka Sučić','Chorwacja'],['Nikola Moro','Chorwacja'],
  ['Martin Baturina','Chorwacja'],['Petar Sučić','Chorwacja'],['Toni Fruk','Chorwacja'],
  ['Marco Pašalić','Chorwacja'],['Ivan Perišić','Chorwacja'],['Andrej Kramarić','Chorwacja'],
  ['Igor Matanović','Chorwacja'],['Petar Musa','Chorwacja'],['Ante Budimir','Chorwacja'],

  // ===== ANGLIA =====
  ['Jordan Pickford','Anglia'],['Dean Henderson','Anglia'],['James Trafford','Anglia'],
  ['Reece James','Anglia'],['Tino Livramento','Anglia'],['Dan Burn','Anglia'],
  ["Nico O'Reilly",'Anglia'],['Marc Guéhi','Anglia'],['John Stones','Anglia'],
  ['Djed Spence','Anglia'],['Ezri Konsa','Anglia'],['Jarell Quansah','Anglia'],
  ['Kobbie Mainoo','Anglia'],['Elliot Anderson','Anglia'],['Declan Rice','Anglia'],
  ['Eberechi Eze','Anglia'],['Jordan Henderson','Anglia'],['Morgan Rogers','Anglia'],
  ['Jude Bellingham','Anglia'],
  ['Harry Kane','Anglia'],['Ivan Toney','Anglia'],['Marcus Rashford','Anglia'],
  ['Anthony Gordon','Anglia'],['Bukayo Saka','Anglia'],['Noni Madueke','Anglia'],
  ['Ollie Watkins','Anglia'],

  // ===== GHANA =====
  ['Joseph Anang','Ghana'],['Benjamin Asare','Ghana'],['Lawrence Ati-Zigi','Ghana'],
  ['Jonas Adjetey','Ghana'],['Derrick Luckassen','Ghana'],['Gideon Mensah','Ghana'],
  ['Abdul Mumin','Ghana'],['Jerome Opoku','Ghana'],['Kojo Eppong Peprah','Ghana'],
  ['Baba Abdul Rahman','Ghana'],['Alidu Seidu','Ghana'],['Marvin Senaya','Ghana'],
  ['Augustine Boakye','Ghana'],['Abdul Fatawu Issahaku','Ghana'],['Elisha Owusu','Ghana'],
  ['Thomas Partey','Ghana'],['Kwasi Sibo','Ghana'],['Kamaldeen Sulemana','Ghana'],
  ['Caleb Yirenki','Ghana'],
  ['Jordan Ayew','Ghana'],['Christopher Bonsu Baah','Ghana'],['Prince Kwabena Adu','Ghana'],
  ['Ernest Nuamah','Ghana'],['Antoine Semenyo','Ghana'],['Brandon Thomas-Asante','Ghana'],
  ['Inaki Williams','Ghana'],

  // ===== PANAMA =====
  ['Luis Mejia','Panama'],['Orlando Mosquera','Panama'],['Cesar Samudio','Panama'],
  ['Andres Andrade','Panama'],['Cesar Blackman','Panama'],['Jose Cordoba','Panama'],
  ['Eric Davis','Panama'],['Fidel Escobar','Panama'],['Edgardo Farina','Panama'],
  ['Jorge Gutierrez','Panama'],['Roderick Miller','Panama'],['Amir Murillo','Panama'],
  ['Jiovany Ramos','Panama'],
  ['Yoel Barcenas','Panama'],['Adalberto Carrasquilla','Panama'],['Anibal Godoy','Panama'],
  ['Carlos Harvey','Panama'],['Azarias Londono','Panama'],['Cristian Martinez','Panama'],
  ['Alberto Quintero','Panama'],['Jose Luis Rodriguez','Panama'],['Cesar Yanis','Panama'],
  ['Ismael Diaz','Panama'],['Jose Fajardo','Panama'],['Tomas Rodriguez','Panama'],
  ['Cecilio Waterman','Panama'],
]

async function main() {
  await prisma.player.deleteMany()

  // Batch insert in chunks to avoid SQLite limits
  const chunkSize = 100
  let inserted = 0
  for (let i = 0; i < PLAYERS.length; i += chunkSize) {
    const chunk = PLAYERS.slice(i, i + chunkSize)
    await prisma.player.createMany({
      data: chunk.map(([name, team]) => ({ name, team })),
    })
    inserted += chunk.length
  }

  const total = await prisma.player.count()
  console.log(`✅ Wgrano ${total} zawodników z ${new Set(PLAYERS.map(([, t]) => t)).size} drużyn.`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
