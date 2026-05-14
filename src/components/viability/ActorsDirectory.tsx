'use client';

import { useState, memo, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Search,
  Filter,
  Users,
  Award,
  Clock,
  ChevronDown,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Navigation,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Toaster } from '@/components/ui/sonner';
import { useToast } from '@/hooks/use-toast';

interface ActorsDirectoryProps {
  onBack?: () => void;
}

// Actor type definition
interface Actor {
  id: string;
  name: string;
  shortName: string | null;
  type: string;
  category: string | null;
  city: string;
  region: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  description: string | null;
  services: any;
  targetAudience: any;
  featured: boolean;
  successRate: number | null;
  projectsSupported: number;
}

// Network type definition
interface Network {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  sector: string | null;
  memberCount: number;
}

// Actor types with colors and labels
const ACTOR_TYPES: Record<string, { label: string; color: string; description: string }> = {
  cci: { label: 'CCI', color: 'bg-blue-500', description: 'Chambre de Commerce et d\'Industrie' },
  cma: { label: 'CMA', color: 'bg-amber-500', description: 'Chambre de Métiers et de l\'Artisanat' },
  incubateur: { label: 'Incubateur', color: 'bg-purple-500', description: 'Structure d\'incubation' },
  accelerateur: { label: 'Accélérateur', color: 'bg-pink-500', description: 'Programme d\'accélération' },
  mission_locale: { label: 'Mission Locale', color: 'bg-emerald-500', description: 'Accompagnement jeunes' },
  pole_emploi: { label: 'France Travail', color: 'bg-cyan-500', description: 'Service public emploi' },
  cap_emploi: { label: 'Cap Emploi', color: 'bg-teal-500', description: 'Handicap et emploi' },
  bge: { label: 'BGE', color: 'bg-orange-500', description: 'Boutiques de Gestion' },
  adie: { label: 'ADIE', color: 'bg-green-500', description: 'Microcrédit et accompagnement' },
  initiative: { label: 'Initiative', color: 'bg-indigo-500', description: 'Réseau Initiative France' },
  reseau_entreprendre: { label: 'Réseau Entreprendre', color: 'bg-rose-500', description: 'Accompagnement créateurs' },
  association: { label: 'Association', color: 'bg-gray-500', description: 'Structure associative' },
  reseaux: { label: 'Réseau', color: 'bg-violet-500', description: 'Réseau d\'entrepreneurs' },
  other: { label: 'Autre', color: 'bg-slate-500', description: 'Autre structure' }
};

// French regions
const REGIONS = [
  'Toutes les régions',
  'Auvergne-Rhône-Alpes',
  'Bourgogne-Franche-Comté',
  'Bretagne',
  'Centre-Val de Loire',
  'Corse',
  'Grand Est',
  'Hauts-de-France',
  'Île-de-France',
  'Normandie',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Pays de la Loire',
  'Provence-Alpes-Côte d\'Azur'
];

// Actor Card Component
const ActorCard = memo(({ 
  actor,
  isBookmarked,
  onToggleBookmark
}: { 
  actor: Actor;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}) => {
  const typeInfo = ACTOR_TYPES[actor.type] || ACTOR_TYPES.other;
  const services = Array.isArray(actor.services) ? actor.services : [];

  return (
    <InteractiveCard className="h-full">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${typeInfo.color} flex items-center justify-center`}>
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">{actor.name}</h3>
              <p className="text-sm text-muted-foreground">{actor.shortName}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggleBookmark}
            className="flex-shrink-0"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5 text-emerald-500" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Type Badge & Featured */}
        <div className="flex items-center gap-2 mb-3">
          <Badge className={`${typeInfo.color} text-white`}>
            {typeInfo.label}
          </Badge>
          {actor.featured && (
            <Badge variant="outline" className="border-amber-500 text-amber-600">
              <Star className="w-3 h-3 mr-1" />
              Recommandé
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {actor.description}
        </p>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <MapPin className="w-4 h-4" />
          <span>{actor.city}{actor.region ? `, ${actor.region}` : ''}</span>
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-1 mb-4">
          {services.slice(0, 3).map((service: any, i: number) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {service.name}
            </Badge>
          ))}
          {services.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{services.length - 3}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          {actor.successRate && (
            <div className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>{actor.successRate}% succès</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{actor.projectsSupported} projets</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {actor.website && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              asChild
            >
              <a href={actor.website} target="_blank" rel="noopener noreferrer">
                <Globe className="w-4 h-4 mr-1" />
                Site web
              </a>
            </Button>
          )}
          {actor.phone && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
            >
              <Phone className="w-4 h-4 mr-1" />
              Contacter
            </Button>
          )}
        </div>
      </div>
    </InteractiveCard>
  );
});

ActorCard.displayName = 'ActorCard';

// Networks Section
const NetworksSection = memo(({ networks, isLoading }: { networks: Network[]; isLoading: boolean }) => {
  if (isLoading) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-purple-500" />
        Réseaux d'entrepreneurs
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {networks.map((network) => (
          <div 
            key={network.id} 
            className="flex items-center justify-between bg-muted/50 rounded-lg p-3 hover:bg-muted/70 cursor-pointer transition-colors"
          >
            <div>
              <p className="font-medium text-sm">{network.name}</p>
              <p className="text-xs text-muted-foreground">{network.sector || 'Multi-secteurs'}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {network.memberCount.toLocaleString('fr-FR')} membres
            </Badge>
          </div>
        ))}
      </div>
    </GlassCard>
  );
});

NetworksSection.displayName = 'NetworksSection';

// Main Component
const ActorsDirectory = memo(({ onBack }: ActorsDirectoryProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Toutes les régions');
  const [selectedType, setSelectedType] = useState('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [actors, setActors] = useState<Actor[]>([]);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [isLoadingActors, setIsLoadingActors] = useState(true);
  const [isLoadingNetworks, setIsLoadingNetworks] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalActors, setTotalActors] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const { toast } = useToast();

  // Fetch actors from API
  const fetchActors = useCallback(async (page: number = 1, append: boolean = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoadingActors(true);
    }
    
    try {
      const params = new URLSearchParams();
      if (selectedRegion !== 'Toutes les régions') params.append('region', selectedRegion);
      if (selectedType !== 'all') params.append('type', selectedType);
      if (searchQuery) params.append('search', searchQuery);
      params.append('page', page.toString());
      params.append('limit', '9');
      
      const response = await fetch(`/api/actors?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        if (append) {
          setActors(prev => [...prev, ...data.data]);
        } else {
          setActors(data.data);
        }
        setTotalActors(data.total);
        setHasMore(data.hasMore);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching actors:', error);
    } finally {
      setIsLoadingActors(false);
      setIsLoadingMore(false);
    }
  }, [searchQuery, selectedRegion, selectedType]);

  // Initial fetch and refetch on filter change
  useEffect(() => {
    setCurrentPage(1);
    const timeoutId = setTimeout(() => fetchActors(1, false), 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedRegion, selectedType, fetchActors]);

  // Load more actors
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchActors(currentPage + 1, true);
    }
  }, [isLoadingMore, hasMore, currentPage, fetchActors]);

  // Fetch networks from API
  useEffect(() => {
    const fetchNetworks = async () => {
      setIsLoadingNetworks(true);
      try {
        const response = await fetch('/api/networks');
        const data = await response.json();
        
        if (data.success) {
          setNetworks(data.data);
        }
      } catch (error) {
        console.error('Error fetching networks:', error);
      } finally {
        setIsLoadingNetworks(false);
      }
    };

    fetchNetworks();
  }, []);

  // Load favorites from API on mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // For now, use a demo user ID. In production, this would come from auth
        const demoUserId = 'demo-user';
        const response = await fetch(`/api/favorites?userId=${demoUserId}`);
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          setBookmarkedIds(new Set(data.data.map((actor: any) => actor.id)));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    fetchFavorites();
  }, []);

  const toggleBookmark = useCallback(async (actorId: string) => {
    const isBookmarked = bookmarkedIds.has(actorId);
    const demoUserId = 'demo-user';
    
    try {
      if (isBookmarked) {
        // Remove from favorites
        await fetch(`/api/favorites?userId=${demoUserId}&actorId=${actorId}`, {
          method: 'DELETE',
        });
        setBookmarkedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(actorId);
          return newSet;
        });
        toast({ title: 'Retiré des favoris' });
      } else {
        // Add to favorites
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: demoUserId, actorId }),
        });
        setBookmarkedIds(prev => {
          const newSet = new Set(prev);
          newSet.add(actorId);
          return newSet;
        });
        toast({ title: 'Ajouté aux favoris' });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({ 
        title: 'Erreur', 
        description: 'Impossible de modifier les favoris',
        variant: 'destructive'
      });
    }
  }, [bookmarkedIds, toast]);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="mb-4">
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Retour
            </Button>
          )}
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Annuaire des Acteurs</h1>
              <p className="text-muted-foreground">Trouvez les structures d'accompagnement près de chez vous</p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="relative sm:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, ville, mot-clé..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Type Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('all')}
              className={selectedType === 'all' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
            >
              Tous
            </Button>
            {Object.entries(ACTOR_TYPES).slice(0, 8).map(([key, value]) => (
              <Button
                key={key}
                variant={selectedType === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(key)}
                className={selectedType === key ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
              >
                {value.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4">
          {totalActors} structure{totalActors !== 1 ? 's' : ''} trouvée{totalActors !== 1 ? 's' : ''}
          {actors.length < totalActors && ` (${actors.length} affichée${actors.length !== 1 ? 's' : ''})`}
        </p>

        {/* Actors Grid */}
        {isLoadingActors ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {actors.map((actor, i) => (
              <motion.div
                key={actor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ActorCard 
                  actor={actor} 
                  isBookmarked={bookmarkedIds.has(actor.id)}
                  onToggleBookmark={() => toggleBookmark(actor.id)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {actors.length === 0 && !isLoadingActors && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
            <p className="text-muted-foreground">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && actors.length > 0 && (
          <div className="flex justify-center mt-6 mb-4">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="px-8"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Chargement...
                </>
              ) : (
                <>
                  Charger plus de résultats
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Networks Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <NetworksSection networks={networks} isLoading={isLoadingNetworks} />
        </motion.div>

        {/* Help Section */}
        <GlassCard className="p-6 mt-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Comment choisir votre accompagnement ?
          </h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>CCI ou CMA ?</AccordionTrigger>
              <AccordionContent>
                La CCI accompagne les projets commerciaux et de services, tandis que la CMA est spécialisée dans l'artisanat. Les deux proposent un accompagnement gratuit pour les formalités.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Incubateur ou Accélérateur ?</AccordionTrigger>
              <AccordionContent>
                L'incubateur accompagne les projets dès l'idée, sur une longue durée (12-24 mois). L'accélérateur s'adresse aux startups en croissance, avec un programme intensif court (3-6 mois).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Besoin de financement ?</AccordionTrigger>
              <AccordionContent>
                ADIE pour le microcrédit, Initiative pour les prêts d'honneur, et BGE pour l'accompagnement au montage financier. France Travail peut aussi financer votre projet via l'ARE création.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </GlassCard>
      </div>
    </div>
  );
});

ActorsDirectory.displayName = 'ActorsDirectory';

export default ActorsDirectory;
