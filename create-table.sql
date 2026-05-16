-- Script de création de table pour Crea Entreprise
-- Base de données : 100jours
-- À exécuter sur PostgreSQL

-- Connexion :
-- psql "postgresql://admin_100jours:J0urs!2026*Cent@109.123.249.114:5432/100jours"

-- Exemple de table pour entreprises
CREATE TABLE IF NOT EXISTS entreprises (
    id SERIAL PRIMARY KEY,
    nom_complet VARCHAR(255) NOT NULL,
    siret VARCHAR(14) UNIQUE,
    email VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    adresse TEXT,
    code_postal VARCHAR(10),
    ville VARCHAR(100),
    pays VARCHAR(100) DEFAULT 'France',
    secteur_activite VARCHAR(100),
    description TEXT,
    site_web VARCHAR(255),
    taille_entreprise VARCHAR(50),
    date_creation DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer un index sur l'email pour des performances optimales
CREATE INDEX IF NOT EXISTS idx_entreprises_email ON entreprises(email);

-- Créer un index sur le siret
CREATE INDEX IF NOT EXISTS idx_entreprises_siret ON entreprises(siret);

-- Créer un index sur la ville pour la recherche géographique
CREATE INDEX IF NOT EXISTS idx_entreprises_ville ON entreprises(ville);

-- Table pour les utilisateurs (si nécessaire)
CREATE TABLE IF NOT EXISTS utilisateurs (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nom_complet VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    mot_de_passe_hash VARCHAR(255),
    entreprise_id INTEGER REFERENCES entreprises(id) ON DELETE SET NULL,
    actif BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les offres (si le site est pour des offres professionnelles)
CREATE TABLE IF NOT EXISTS offres (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    entreprise_id INTEGER REFERENCES entreprises(id) ON DELETE CASCADE,
    type_poste VARCHAR(100),
    secteur VARCHAR(100),
    lieu VARCHAR(255),
    salaire_min DECIMAL(10, 2),
    salaire_max DECIMAL(10, 2),
    date_publication DATE DEFAULT CURRENT_DATE,
    date_expiration DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour les offres
CREATE INDEX IF NOT EXISTS idx_offres_entreprise ON offres(entreprise_id);
CREATE INDEX IF NOT EXISTS idx_offres_statut ON offres(status);
CREATE INDEX IF NOT EXISTS idx_offres_secteur ON offres(secteur);

-- Insérer des données de test (optionnel)
-- INSERT INTO entreprises (nom_complet, email, siret, ville, secteur_activite)
-- VALUES
--     ('Entreprise Exemple SARL', 'contact@example.com', '12345678900012', 'Paris', 'Technologie'),
--     ('Startup Innovation', 'hello@startup.fr', '98765432100012', 'Lyon', 'Digital');

-- Afficher les tables créées
\dt

-- Afficher la structure de la table entreprises
\d entreprises

-- Quitter
\q
