"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type BadgeData, RARITY_CONFIG } from "./BadgeDisplay";
import {
  Download,
  Share2,
  Printer,
  FileText,
  Award,
  Star,
  Trophy,
  Crown,
  Sparkles,
  Check,
  Copy,
  ExternalLink,
} from "lucide-react";

// Certificate template component
interface CertificateTemplateProps {
  userName: string;
  badges: BadgeData[];
  completionDate: Date;
  totalPoints: number;
  isPreview?: boolean;
}

export function CertificateTemplate({
  userName,
  badges,
  completionDate,
  totalPoints,
  isPreview = false,
}: CertificateTemplateProps) {
  const earnedBadges = badges.filter((b) => b.earned);
  const legendaryBadges = earnedBadges.filter((b) => b.rarity === "legendary");
  const epicBadges = earnedBadges.filter((b) => b.rarity === "epic");

  return (
    <div
      id="certificate"
      className={cn(
        "bg-white text-gray-900 relative overflow-hidden",
        isPreview
          ? "rounded-xl shadow-xl"
          : "w-[800px] min-h-[600px] p-8"
      )}
      style={{
        background: "linear-gradient(135deg, #fefefe 0%, #f8f8f8 50%, #fefefe 100%)",
      }}
    >
      {/* Decorative border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: "3px solid",
          borderImage: "linear-gradient(135deg, #fbbf24, #a855f7, #f43f5e, #06b6d4) 1",
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-4 border-t-4 border-amber-400" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 border-purple-400" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-4 border-b-4 border-cyan-400" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4 border-rose-400" />

      {/* Content */}
      <div className="relative z-10 text-center p-8">
        {/* Header */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2">
            <Crown className="w-8 h-8 text-amber-500" />
            <span className="text-xl font-bold tracking-widest text-gray-600">
              PATHFINDER IA
            </span>
            <Crown className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-amber-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
          CERTIFICAT D&apos;ACCOMPLISSEMENT
        </h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2 my-4">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-400" />
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-400" />
        </div>

        {/* Recipient */}
        <p className="text-lg text-gray-600 mb-2">Ce certificat est presente a</p>
        <h2 className="text-3xl font-bold mb-4 text-gray-900">{userName}</h2>

        {/* Achievement text */}
        <p className="text-gray-600 mb-6 max-w-lg mx-auto">
          Pour avoir complete avec succes le parcours de developpement professionnel
          et obtenu les badges suivants
        </p>

        {/* Badges earned */}
        <div className="flex justify-center gap-2 flex-wrap mb-6">
          {earnedBadges.slice(0, 6).map((badge) => (
            <div
              key={badge.id}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium text-white",
                `bg-gradient-to-r ${RARITY_CONFIG[badge.rarity].gradient}`
              )}
            >
              {badge.emoji ? `${badge.emoji} ` : ""}
              {badge.name}
            </div>
          ))}
          {earnedBadges.length > 6 && (
            <div className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-200 text-gray-600">
              +{earnedBadges.length - 6} autres
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">{earnedBadges.length}</div>
            <div className="text-sm text-gray-500">Badges</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600">{totalPoints}</div>
            <div className="text-sm text-gray-500">Points</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{legendaryBadges.length + epicBadges.length}</div>
            <div className="text-sm text-gray-500">Badges Rares</div>
          </div>
        </div>

        {/* Trophy icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Date */}
        <p className="text-gray-500 text-sm">
          Delivre le {completionDate.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        {/* Signature area */}
        <div className="mt-8 flex justify-center">
          <div className="text-center">
            <div className="h-px w-40 bg-gray-400 mb-2" />
            <p className="text-sm font-medium">Signature Pathfinder IA</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Certificate Generator Component
interface CertificateGeneratorProps {
  userName: string;
  badges: BadgeData[];
  totalPoints: number;
}

export function CertificateGenerator({
  userName,
  badges,
  totalPoints,
}: CertificateGeneratorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const certificateRef = React.useRef<HTMLDivElement>(null);

  const earnedBadges = badges.filter((b) => b.earned);
  const canGenerateCertificate = earnedBadges.length >= 3;

  const completionDate = new Date();

  // Generate PDF
  const handleDownloadPDF = async () => {
    setIsGenerating(true);

    try {
      // Use html2canvas and jsPDF approach via dynamic import
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      if (certificateRef.current) {
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [canvas.width, canvas.height],
        });

        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save(`certificat-pathfinder-${userName.toLowerCase().replace(/\s+/g, "-")}.pdf`);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback: open print dialog
      window.print();
    }

    setIsGenerating(false);
  };

  // Print certificate
  const handlePrint = () => {
    window.print();
  };

  // Share certificate
  const handleShare = async () => {
    const shareData = {
      title: "Mon Certificat Pathfinder IA",
      text: `J'ai obtenu ${earnedBadges.length} badges et ${totalPoints} points sur Pathfinder IA !`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // Copy to clipboard
      await navigator.clipboard.writeText(
        `${shareData.text} ${shareData.url}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Copy certificate link
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Certificate Trigger Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            disabled={!canGenerateCertificate}
            className={cn(
              "gap-2",
              canGenerateCertificate
                ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                : ""
            )}
          >
            <Award className="w-4 h-4" />
            Generer Certificat
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Certificat d&apos;Accomplissement
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Certificate Preview */}
            <div
              ref={certificateRef}
              className="mx-auto overflow-hidden shadow-lg"
            >
              <CertificateTemplate
                userName={userName}
                badges={badges}
                completionDate={completionDate}
                totalPoints={totalPoints}
                isPreview={true}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                {isGenerating ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Telecharger PDF
              </Button>

              <Button
                variant="outline"
                onClick={handlePrint}
                className="gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimer
              </Button>

              <Button
                variant="outline"
                onClick={handleShare}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                Partager
              </Button>

              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    Copie !
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copier Lien
                  </>
                )}
              </Button>
            </div>

            {/* Info */}
            <p className="text-center text-sm text-gray-500">
              Partagez votre accomplissement sur les reseaux sociaux ou telechargez
              votre certificat en PDF
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Requirements message when not enough badges */}
      {!canGenerateCertificate && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          Obtenez au moins 3 badges pour generer votre certificat
        </p>
      )}
    </>
  );
}

// Certificate Preview Card for Dashboard
interface CertificatePreviewCardProps {
  userName: string;
  badges: BadgeData[];
  totalPoints: number;
}

export function CertificatePreviewCard({
  userName,
  badges,
  totalPoints,
}: CertificatePreviewCardProps) {
  const earnedBadges = badges.filter((b) => b.earned);
  const canGenerate = earnedBadges.length >= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl p-6 relative overflow-hidden",
        canGenerate
          ? "bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-200 dark:border-amber-800"
          : "bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700"
      )}
    >
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20">
        <div
          className={cn(
            "w-full h-full",
            canGenerate
              ? "bg-gradient-to-br from-amber-400 to-orange-500"
              : "bg-gray-400"
          )}
        />
      </div>

      <div className="relative flex items-center gap-6">
        {/* Certificate icon */}
        <div
          className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center",
            canGenerate
              ? "bg-gradient-to-br from-amber-400 to-orange-500"
              : "bg-gray-300 dark:bg-gray-700"
          )}
        >
          <Award className="w-8 h-8 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">Votre Certificat</h3>
          {canGenerate ? (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Vous avez debloque {earnedBadges.length} badges ! Generez votre
              certificat d&apos;accomplissement.
            </p>
          ) : (
            <p className="text-gray-500 text-sm">
              Obtenez {3 - earnedBadges.length} badge(s) supplementaire(s) pour
              debloquer votre certificat.
            </p>
          )}
        </div>

        {/* Action */}
        <CertificateGenerator
          userName={userName}
          badges={badges}
          totalPoints={totalPoints}
        />
      </div>
    </motion.div>
  );
}

// Share modal component
interface ShareCertificateProps {
  isOpen: boolean;
  onClose: () => void;
  certificateUrl: string;
}

export function ShareCertificateModal({
  isOpen,
  onClose,
  certificateUrl,
}: ShareCertificateProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(certificateUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: ExternalLink,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificateUrl)}`,
      color: "bg-[#0077b5]",
    },
    {
      name: "Twitter",
      icon: ExternalLink,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent("J'ai obtenu mon certificat Pathfinder IA !")}&url=${encodeURIComponent(certificateUrl)}`,
      color: "bg-[#1da1f2]",
    },
    {
      name: "Facebook",
      icon: ExternalLink,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(certificateUrl)}`,
      color: "bg-[#1877f2]",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Partager le Certificat</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Social buttons */}
          <div className="flex justify-center gap-3">
            {socialLinks.map((social) => (
              <Button
                key={social.name}
                className={cn("gap-2", social.color)}
                onClick={() => window.open(social.url, "_blank")}
              >
                <social.icon className="w-4 h-4" />
                {social.name}
              </Button>
            ))}
          </div>

          {/* Copy link */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={certificateUrl}
              readOnly
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
            />
            <Button variant="outline" onClick={handleCopy}>
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
