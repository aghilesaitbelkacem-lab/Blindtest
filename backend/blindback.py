from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import random
from collections import defaultdict

app = Flask(__name__)
CORS(app)

# ── Artistes par genre ────────────────────────────────────────────────────────
ARTISTES_PAR_GENRE = {
    'rap': [
       'Eminem', 'Drake', 'Kendrick Lamar', 'Jay-Z', 'Kanye West',
        'Lil Wayne', 'Nicki Minaj', 'Travis Scott', 'J. Cole', 'Cardi B',
        'Post Malone', 'Future', 'Juice WRLD', 'XXXTentacion', 'Lil Uzi Vert',
        '21 Savage', 'Roddy Ricch', 'DaBaby', 'Gunna', 'Lil Baby',
        'Megan Thee Stallion', 'Tyler the Creator', 'A$AP Rocky', 'Childish Gambino',
        'Mac Miller', 'Logic', 'Big Sean', 'Wiz Khalifa', 'Meek Mill',
        'Rick Ross', 'Lil Durk', 'Polo G', 'NBA YoungBoy', 'Kevin Gates',
        'YNW Melly', 'Lil Skies', 'Trippie Redd', 'Lil Tecca', 'Ski Mask',
        'Pop Smoke', 'Lil Keed', 'Moneybagg Yo', '42 Dugg', 'EST Gee'
    ],
    'rap_fr': [
    'Nekfeu', 'Booba', 'Kaaris', 'SCH', 'Ninho', 'Damso', 'Hamza',
    'Freeze Corleone', 'Laylow', 'Orelsan', 'Jul',
    'PNL', 'Heuss L\'enfoiré', 'Gazo', 'Tiakola', 'Favé',
    'Niska', 'Leto', 'Sofiane', 'Gradur', 'Lacrim', 'Maes',
    'Alonzo', 'Koba LaD', 'SDM', 'Franglish', 'Soolking',
    'Rim\'K', 'Oxmo Puccino', 'IAM', 'Suprême NTM', 'Kery James',
    'Médine', 'Youssoupha', 'Lomepal', 'Bigflo & Oli',
    'Vald', 'Alkpote', 'Josman', 'Jazzy Bazz', 'Dinos',
    'Prince Waly', 'Lefa', 'Dosseh', 'Zola', 'Ziak',
    'Guy2Bezbar', 'Green Montana', 'Krisy', 'Keblack',
    'Mister You', 'Mokobé', 'Rohff', 'Sefyu', 'La Fouine',
    'Sinik', 'Soprano', 'Black M', 'Sultan', 'Timal',
    'Naps', 'MHD', 'Kalash Criminel', 'Kofs',
    'Hornet La Frappe', 'RK', '1PLIKÉ140', 'Zed', 'ISK',
    'Kerchak', 'Djadja & Dinaz', 'Zamdane', 'Benab',
    'Meryl', 'UZI', 'Yamê', 'TH', 'La Mano 1.9',
    'Bekar', 'Luidji', 'Georgio',
    'Hugo TSR', 'Alpha Wann', 'Fianso', 'Sniper',
    'Scred Connexion', 'Ärsenik', 'Fonky Family', '113',
    'Disiz', 'S.Pri Noir', 'Kaza', 'Doria', 'Nahir', 'Fresh', 'Merveille', 'Landy',
    'Theodora', 'Aya Nakamura', 'Rounhaa', 'Yvnnis', 'Jolagreen23',
    'Rsko', 'Osirus Jack', 'Ashe 22', 'Werenoi', 'Tsew The Kid',
    'Gims', 'Vegedream', 'Dadju', 'Tayc',
    ]
        ,
    'rnb': [
        'Beyoncé', 'Rihanna', 'The Weeknd', 'Frank Ocean', 'SZA',
        'Usher', 'Chris Brown', 'Alicia Keys', 'John Legend', 'H.E.R.',
        'Jhené Aiko', 'Miguel', 'Bryson Tiller', 'Summer Walker', 'Kehlani',
        'Khalid', 'Daniel Caesar', 'Lucky Daye', 'Giveon', 'Brent Faiyaz',
        'Victoria Monét', 'Chloe Bailey', 'Ella Mai', 'Ari Lennox', 'Jazmine Sullivan',
        'Mary J. Blige', 'Toni Braxton', 'Lauryn Hill', 'Erykah Badu', 'D\'Angelo',
        'Maxwell', 'Ne-Yo', 'Mario', 'Tank', 'Ginuwine',
        'Destiny\'s Child', 'TLC', 'Aaliyah', 'Janet Jackson', 'Ciara',
        'Tinashe', 'Normani', 'Doja Cat', 'Kali Uchis', 'H.E.R.','RnBoi'
    ],
    'rock': [
        'Nirvana', 'AC/DC', 'Queen', 'Metallica', 'Red Hot Chili Peppers',
        'Foo Fighters', 'Linkin Park', 'Green Day', 'The Rolling Stones', 'U2',
        'Radiohead', 'Arctic Monkeys', 'Muse', 'Pearl Jam', 'Soundgarden',
        'The Strokes', 'Rage Against the Machine', 'System of a Down',
        'Guns N\' Roses', 'Aerosmith', 'Led Zeppelin', 'Pink Floyd', 'The Doors',
        'Jimi Hendrix', 'The Who', 'Black Sabbath', 'Ozzy Osbourne', 'Iron Maiden',
        'Judas Priest', 'Slayer', 'Megadeth', 'Pantera', 'Slipknot',
        'Korn', 'Limp Bizkit', 'Marilyn Manson', 'Nine Inch Nails', 'Tool',
        'Alice in Chains', 'Stone Temple Pilots', 'Smashing Pumpkins', 'Beck',
        'The Killers', 'Interpol', 'Franz Ferdinand', 'Kaiser Chiefs', 'Bloc Party'
    ],
    'techno': [
        'Daft Punk', 'The Prodigy', 'Chemical Brothers', 'Aphex Twin',
        'Deadmau5', 'Richie Hawtin', 'Carl Cox', 'Sven Väth',
        'Nina Kraviz', 'Charlotte de Witte', 'Amelie Lens', 'Adam Beyer',
        'Jeff Mills', 'Ben Klock', 'Marcel Dettmann', 'Surgeon',
        'Chris Liebing', 'Dave Clarke', 'Perc', 'Ancient Methods',
        'Blawan', 'Shifted', 'Rrose', 'Paula Temple',
        'Kobosil', 'Alignment', 'I Hate Models', 'Rebekah'
    ],
    'house': [
        'David Guetta', 'Calvin Harris', 'Martin Garrix', 'Tiësto',
        'Avicii', 'Kygo', 'Disclosure', 'Duke Dumont', 'MK', 'Fisher',
        'Tchami', 'Malaa', 'DJ Snake', 'Skrillex', 'Diplo',
        'Eric Prydz', 'Bicep disclosure', 'Jamie xx', 'Four Tet', 'Caribou',
        'Peggy Gou', 'Honey Dijon', 'Larry Heard', 'Frankie Knuckles', 'Larry Levan',
        'Marshall Jefferson', 'Todd Terry', 'Roger Sanchez', 'Kerri Chandler',
        'Masters At Work', 'Louie Vega', 'Kenny Dope', 'Dimitri from Paris',
        'Bob Sinclar', 'Stardust', 'Cassius', 'Motez', 'Chris Lake'
    ],
    'pop': [
        'Taylor Swift', 'Ed Sheeran', 'Ariana Grande', 'Justin Bieber',
        'Billie Eilish', 'Harry Styles', 'Dua Lipa', 'Bruno Mars',
        'Katy Perry', 'Lady Gaga', 'Adele', 'Selena Gomez', 'Miley Cyrus',
        'Sam Smith', 'Charlie Puth', 'Shawn Mendes', 'Olivia Rodrigo',
        'Lizzo', 'Halsey', 'Camila Cabello', 'Bebe Rexha', 'Meghan Trainor',
        'Jason Derulo', 'Troye Sivan', 'Lorde', 'Lana Del Rey', 'Sia',
        'P!nk', 'Avril Lavigne', 'Nelly Furtado', 'Britney Spears', 'Christina Aguilera',
        'Beyoncé', 'Rihanna', 'Michael Jackson', 'Madonna', 'Whitney Houston',
        'Mariah Carey', 'Celine Dion', 'Cher', 'Elton John', 'George Michael'
    ],
    'soul': [
        'Aretha Franklin', 'Stevie Wonder', 'Marvin Gaye', 'Ray Charles',
        'Sam Cooke', 'Al Green', 'Otis Redding', 'Bill Withers',
        'Amy Winehouse', 'Lauryn Hill', 'D\'Angelo', 'Maxwell', 'Erykah Badu',
        'James Brown', 'Wilson Pickett', 'Percy Sledge', 'Solomon Burke',
        'Curtis Mayfield', 'Isaac Hayes', 'Barry White', 'Luther Vandross',
        'Anita Baker', 'Gladys Knight', 'Diana Ross', 'Smokey Robinson',
        'Four Tops', 'The Temptations', 'Commodores', 'Earth Wind & Fire',
        'Lionel Richie', 'Teddy Pendergrass', 'Patti LaBelle', 'Chaka Khan',
        'Roberta Flack', 'Donny Hathaway', 'Natalie Cole', 'Dionne Warwick'
    ],
    'jazz': [
        'Miles Davis', 'John Coltrane', 'Louis Armstrong', 'Ella Fitzgerald',
        'Duke Ellington', 'Charlie Parker', 'Thelonious Monk', 'Chet Baker',
        'Billie Holiday', 'Dave Brubeck', 'Herbie Hancock', 'Norah Jones',
        'Bill Evans', 'Charles Mingus', 'Dizzy Gillespie', 'Clifford Brown',
        'Wes Montgomery', 'Joe Pass', 'Pat Metheny', 'John Scofield',
        'Wayne Shorter', 'Sonny Rollins', 'Art Blakey', 'Max Roach',
        'Oscar Peterson', 'Ahmad Jamal', 'Chick Corea', 'McCoy Tyner',
        'Keith Jarrett', 'Brad Mehldau', 'Diana Krall', 'Michael Bublé'
    ],
    'latino': [
        'Bad Bunny', 'J Balvin', 'Daddy Yankee', 'Shakira', 'Maluma',
        'Ozuna', 'Anuel AA', 'Karol G', 'Nicky Jam', 'Farruko',
        'Rauw Alejandro', 'Myke Towers', 'Sech', 'Jhay Cortez', 'Camilo',
        'Luis Fonsi', 'Enrique Iglesias', 'Marc Anthony', 'Jennifer Lopez',
        'Pitbull', 'Flo Rida', 'Becky G', 'Anitta', 'Cardi B',
        'Don Omar', 'Wisin & Yandel', 'Aventura', 'Romeo Santos', 'Prince Royce',
        'Carlos Vives', 'Juanes', 'Alejandro Sanz', 'Ricky Martin', 'Gloria Estefan',
        'Selena', 'Celia Cruz', 'Marc Anthony', 'Willie Colon', 'Hector Lavoe'
    ],
    'rai': [
        'Khaled', 'Cheb Mami', 'Faudel', 'Rachid Taha', 'Cheb Hasni',
        'Cheb Bilal', 'Cheb Akil', 'Cheba Fadela', 'Cheb Tarik',
        'Cheb Adjel', 'Cheb Nadir', 'Cheb Bachir', 'Cheb Azzedine',
        'Cheb Nasro', 'Cheb Wahid', 'Cheb Khaled', 'Cheb Sahraoui',
        'Cheb Hamid', 'Cheba Zahouania', 'Cheba Dalila', 'Cheb Bello',
        'Cheb Nordine', 'Cheb Sofiane', 'Cheb Houssem', 'Cheb Mourad',
        'Cheb Redouane', 'Cheb Yacine', 'Cheb Djalil', 'Cheb Lotfi',
        'Cheb Abbes', 'Cheb Rabah', 'Cheb Yazid', 'Cheb Fethi',
        'Cheb Nabil', 'Cheb Anouar', 'Cheb Riad', 'Cheb Amar','Cheb Hichem TGV','Cheba Warda'
    ],
}

# ── Rank minimum selon difficulté ─────────────────────────────────────────────
DIFFICULTE_MAP = {
    'facile':    1000000,
    'moyen':     800000,
    'difficile': 500000,
}

def chercher_artiste_deezer(nom_artiste):
    """Cherche l'ID d'un artiste sur Deezer par son nom"""
    try:
        url = f"https://api.deezer.com/search/artist?q={nom_artiste}&limit=1"
        resp = requests.get(url, timeout=8)
        data = resp.json().get('data', [])
        if data:
            return data[0]['id']
    except:
        pass
    return None

def get_top_tracks_artiste(artiste_id, rank_min):
    """Récupère les top chansons d'un artiste avec preview disponible"""
    chansons = []
    try:
        url = f"https://api.deezer.com/artist/{artiste_id}/top?limit=20"
        resp = requests.get(url, timeout=8)
        tracks = resp.json().get('data', [])

        for track in tracks:
            if (
                track.get('preview')           # preview disponible
                and track.get('rank', 0) >= rank_min  # assez populaire
            ):
                chansons.append({
                    'titre':   track['title'],
                    'artiste': track['artist']['name'],
                    'preview': track['preview'],
                    'cover':   track['album']['cover_medium'],
                    'rank':    track['rank'],
                })
    except:
        pass
    return chansons


@app.route('/api/chansons', methods=['GET'])
def get_chansons():

    genres_param = request.args.get('genres', 'pop')
    difficulte   = request.args.get('difficulte', 'facile')

    genres_list = [g.strip() for g in genres_param.split(',')]
    rank_min    = DIFFICULTE_MAP.get(difficulte, 200000)

    toutes_chansons = []

    for genre in genres_list:
        artistes = ARTISTES_PAR_GENRE.get(genre, [])
        if not artistes:
            continue

        # Mélange les artistes pour varier à chaque partie
        artistes_melanges = artistes.copy()
        random.shuffle(artistes_melanges)

        # On prend max 10 artistes par genre pour ne pas trop appeler Deezer
        for nom_artiste in artistes_melanges[:10]:

            # 1. Cherche l'ID de l'artiste sur Deezer
            artiste_id = chercher_artiste_deezer(nom_artiste)
            if not artiste_id:
                continue

            # 2. Récupère ses top chansons
            chansons = get_top_tracks_artiste(artiste_id, rank_min)
            toutes_chansons.extend(chansons)

            # Si on a assez de chansons on arrête
            if len(toutes_chansons) >= 40:
                break

    # Si pas assez de chansons → on baisse le filtre de rank
    if len(toutes_chansons) < 10:
        print("Pas assez, on baisse le rank...")
        for genre in genres_list:
            artistes = ARTISTES_PAR_GENRE.get(genre, [])
            random.shuffle(artistes)
            for nom_artiste in artistes[:8]:
                artiste_id = chercher_artiste_deezer(nom_artiste)
                if not artiste_id:
                    continue
                chansons = get_top_tracks_artiste(artiste_id, rank_min=0)
                toutes_chansons.extend(chansons)
                if len(toutes_chansons) >= 40:
                    break

    # Supprime les doublons par titre
    vus = set()
    chansons_uniques = []
    for c in toutes_chansons:
        if c['titre'] not in vus:
            vus.add(c['titre'])
            chansons_uniques.append(c)

    # Limite à 2 chansons max par artiste
        compteur_artiste = defaultdict(int)
        chansons_filtrees = []

    for c in chansons_uniques:
        if compteur_artiste[c['artiste']] < 2:
            chansons_filtrees.append(c)
            compteur_artiste[c['artiste']] += 1

    chansons_uniques = chansons_filtrees

    # Mélange et sélectionne 10 chansons
    random.shuffle(chansons_uniques)
    selection = chansons_uniques[:10]

    if len(selection) < 10:
        return jsonify({
            'erreur': 'Pas assez de chansons trouvées. Essaie un autre genre ou une difficulté plus facile.'
        }), 404

    # Génère les 4 mauvaises réponses pour chaque chanson
    tous_titres = [c['titre'] for c in chansons_uniques]

    resultat = []
    for chanson in selection:
        mauvaises = [t for t in tous_titres if t != chanson['titre']]
        mauvaises = random.sample(mauvaises, min(4, len(mauvaises)))

        choix = mauvaises + [chanson['titre']]
        random.shuffle(choix)

        resultat.append({
            'titre':   chanson['titre'],
            'artiste': chanson['artiste'],
            'preview': chanson['preview'],
            'cover':   chanson['cover'],
            'choix':   choix,
        })

    return jsonify(resultat)


if __name__ == '__main__':
    app.run(debug=True, port=5000)