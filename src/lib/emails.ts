// ─── EMAIL TEMPLATES FOR PROSPECTION ────────────────────────────────
// TABLE-based layout, inline CSS, max-width 600px, no JS
// Compatible: Gmail, Outlook, Apple Mail, Yahoo

export const email1Meta = {
  id: "reconversion",
  title: "Salariés en Reconversion",
  subject: "Vous envisagez de créer votre entreprise ? Recevez votre plan d'action gratuit",
  target: "Salariés en reconversion professionnelle",
  approach: "Pédagogique, empathique, rassurante",
  color: "emerald",
};

export const email2Meta = {
  id: "reglementees",
  title: "Professions Réglementées",
  subject: "Votre métier est réglementé — Découvrez les démarches obligatoires en 2 minutes",
  target: "Médecins, avocats, restaurateurs, agents immobiliers, BTP artisans, coiffeurs, coachs sportifs, etc.",
  approach: "Expertise, conformité, urgence réglementaire",
  color: "rose",
};

export const email3Meta = {
  id: "b2b",
  title: "Consultants & Experts B2B",
  subject: "Comment générer 10+ leads qualifiés B2B par mois — sans recruter",
  target: "Freelances, consultants, prestataires B2B",
  approach: "ROI, performance, data-driven",
  color: "violet",
};

// ─── EMAIL 1: Salariés en Reconversion ─────────────────────────────

export const email1HTML = `<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Vous envisagez de créer votre entreprise ?</title>
  <style type="text/css">
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .hero-padding { padding: 24px 20px !important; }
      .content-padding { padding: 24px 20px !important; }
      .footer-padding { padding: 20px !important; }
      .hero-title { font-size: 22px !important; line-height: 30px !important; }
      .section-title { font-size: 18px !important; }
      .step-table { width: 100% !important; }
      .step-cell { display: block !important; width: 100% !important; padding: 8px 0 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f0fdf4; font-family: Arial, Helvetica, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">

  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f0fdf4;">
    <tr>
      <td align="center" style="padding: 20px 10px;">

        <!-- Email Container 600px -->
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header / Logo -->
          <tr>
            <td style="background-color: #064e3b; padding: 20px 30px; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="text-align: center;">
                    <span style="font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">Créa Entreprise</span>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 4px;">
                    <span style="font-size: 11px; color: #a7f3d0; letter-spacing: 2px; text-transform: uppercase;">Guides &bull; Outils &bull; Accompagnement</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Section -->
          <tr>
            <td class="hero-padding" style="background: linear-gradient(135deg, #059669 0%, #0d9488 50%, #0f766e 100%); padding: 40px 30px; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 16px 0; font-size: 14px; color: #d1fae5; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">PARCOURS RECONVERSION</p>
                    <h1 class="hero-title" style="margin: 0 0 20px 0; font-size: 26px; font-weight: 700; color: #ffffff; line-height: 34px;">Vous envisagez de quitter le salariat pour créer votre entreprise ?</h1>
                    <p style="margin: 0; font-size: 15px; color: #ecfdf5; line-height: 24px;">On comprend cette hésitation. Et on est là pour vous accompagner, étape par étape.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Empathy Section -->
          <tr>
            <td class="content-padding" style="padding: 32px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151; line-height: 24px;">Bonjour <strong>[Prénom]</strong>,</p>
                    <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151; line-height: 24px;">Lancer sa propre entreprise est l'une des décisions les plus importantes de sa vie. Et si vous lisez cet email, c'est que cette idée vous trotte dans la tête — peut-être depuis des mois.</p>
                    <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151; line-height: 24px;">La peur de quitter un CDI, l'incertitude financière, les démarches administratives... On sait exactement ce que vous ressentez. Chez <strong>Créa Entreprise</strong>, on a accompagné des <strong>centaines de salariés en reconversion</strong>, et on sait que le bon parcours fait toute la différence.</p>
                    <p style="margin: 0; font-size: 15px; color: #374151; line-height: 24px;">La bonne nouvelle ? Vous n'êtes pas obligé(e) de tout faire seul(e).</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top: 1px solid #e5e7eb; font-size: 0; height: 1px; line-height: 0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- Parcours Section -->
          <tr>
            <td class="content-padding" style="padding: 32px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 6px 0; font-size: 12px; color: #059669; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">VOTRE PARCOURS RECONVERSION</p>
                    <h2 class="section-title" style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #111827;">Un accompagnement progressif, à votre rythme</h2>
                    <p style="margin: 0 0 24px 0; font-size: 14px; color: #6b7280; line-height: 22px;">Chaque étape est conçue pour avancer sans risque. Du premier diagnostic au lancement, voici le parcours que des centaines de reconvertis ont suivi avec succès :</p>
                  </td>
                </tr>

                <!-- Step 1 -->
                <tr>
                  <td style="padding-bottom: 16px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ecfdf5; border-radius: 8px; border-left: 4px solid #059669;">
                      <tr>
                        <td style="padding: 14px 18px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="40" valign="top" style="padding-right: 12px;">
                                <div style="width: 32px; height: 32px; background-color: #059669; border-radius: 50%; text-align: center; line-height: 32px; font-size: 14px; font-weight: 700; color: #ffffff;">1</div>
                              </td>
                              <td>
                                <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 700; color: #064e3b;">Formation Entrepreneur</p>
                                <p style="margin: 0; font-size: 13px; color: #374151; line-height: 20px;">Les fondamentaux : statut juridique, fiscalité, charges sociales. Devenez autonome sur les bases.</p>
                                <p style="margin: 6px 0 0 0; font-size: 12px; color: #059669; font-weight: 600;">Dès 19€ / session</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Step 2 -->
                <tr>
                  <td style="padding-bottom: 16px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ecfdf5; border-radius: 8px; border-left: 4px solid #0d9488;">
                      <tr>
                        <td style="padding: 14px 18px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="40" valign="top" style="padding-right: 12px;">
                                <div style="width: 32px; height: 32px; background-color: #0d9488; border-radius: 50%; text-align: center; line-height: 32px; font-size: 14px; font-weight: 700; color: #ffffff;">2</div>
                              </td>
                              <td>
                                <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 700; color: #064e3b;">Copilote Entreprise</p>
                                <p style="margin: 0; font-size: 13px; color: #374151; line-height: 20px;">Un expert dédié vous guide mois par mois. Stratégie, décisions, priorités — ne vous trompez plus.</p>
                                <p style="margin: 6px 0 0 0; font-size: 12px; color: #0d9488; font-weight: 600;">Dès 89€ / mois</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Step 3 -->
                <tr>
                  <td style="padding-bottom: 16px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ecfdf5; border-radius: 8px; border-left: 4px solid #14b8a6;">
                      <tr>
                        <td style="padding: 14px 18px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="40" valign="top" style="padding-right: 12px;">
                                <div style="width: 32px; height: 32px; background-color: #14b8a6; border-radius: 50%; text-align: center; line-height: 32px; font-size: 14px; font-weight: 700; color: #ffffff;">3</div>
                              </td>
                              <td>
                                <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 700; color: #064e3b;">Community Management</p>
                                <p style="margin: 0; font-size: 13px; color: #374151; line-height: 20px;">On gère votre présence en ligne pendant que vous vous concentrez sur votre activité.</p>
                                <p style="margin: 6px 0 0 0; font-size: 12px; color: #14b8a6; font-weight: 600;">Dès 149€ / mois</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Step 4 -->
                <tr>
                  <td style="padding-bottom: 16px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ecfdf5; border-radius: 8px; border-left: 4px solid #2dd4bf;">
                      <tr>
                        <td style="padding: 14px 18px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="40" valign="top" style="padding-right: 12px;">
                                <div style="width: 32px; height: 32px; background-color: #2dd4bf; border-radius: 50%; text-align: center; line-height: 32px; font-size: 14px; font-weight: 700; color: #ffffff;">4</div>
                              </td>
                              <td>
                                <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 700; color: #064e3b;">Site Web Professionnel</p>
                                <p style="margin: 0; font-size: 13px; color: #374151; line-height: 20px;">Un site vitrine moderne et optimisé pour convertir vos visiteurs en clients.</p>
                                <p style="margin: 6px 0 0 0; font-size: 12px; color: #2dd4bf; font-weight: 600;">Dès 399€</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Step 5 -->
                <tr>
                  <td>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ecfdf5; border-radius: 8px; border-left: 4px solid #5eead4;">
                      <tr>
                        <td style="padding: 14px 18px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="40" valign="top" style="padding-right: 12px;">
                                <div style="width: 32px; height: 32px; background-color: #5eead4; border-radius: 50%; text-align: center; line-height: 32px; font-size: 14px; font-weight: 700; color: #064e3b;">5</div>
                              </td>
                              <td>
                                <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 700; color: #064e3b;">Marketing Digital</p>
                                <p style="margin: 0; font-size: 13px; color: #374151; line-height: 20px;">SEO, publicité ciblée, content marketing — on attire vos premiers clients.</p>
                                <p style="margin: 6px 0 0 0; font-size: 12px; color: #2dd4bf; font-weight: 600;">Dès 169€ / mois</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Pack Highlight -->
          <tr>
            <td style="padding: 0 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #064e3b, #065f46); border-radius: 10px; overflow: hidden;">
                <tr>
                  <td style="padding: 28px 24px; text-align: center;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #6ee7b7; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">PACK STARTUP — TOUT-IN-UN</p>
                    <p style="margin: 0 0 12px 0; font-size: 32px; font-weight: 700; color: #ffffff;">1 790€</p>
                    <p style="margin: 0 0 16px 0; font-size: 14px; color: #a7f3d0; line-height: 20px;">Formation + Copilote 3 mois + Site Web + Marketing 2 mois<br />Économisez plus de 40% par rapport aux services séparés</p>
                    <p style="margin: 0; font-size: 12px; color: #6ee7b7;">Ou des accès individuels dès 19€ / session</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Spacing -->
          <tr><td style="height: 24px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

          <!-- CTA Section -->
          <tr>
            <td style="padding: 0 30px 32px 30px; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 0 20px;">
                    <p style="margin: 0 0 20px 0; font-size: 15px; color: #374151; line-height: 24px; text-align: center;"><strong>Commencez par l'étape la plus importante :</strong><br />obtenez votre diagnostic personnalisé gratuit.</p>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="background-color: #059669; border-radius: 8px;">
                          <a href="https://crea-entreprise-rho.vercel.app/#audit" target="_blank" style="display: inline-block; padding: 16px 40px; font-size: 16px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 8px; background-color: #059669;">Générer mon audit gratuit →</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 12px; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #9ca3af;">Résultats personnalisés en 2 minutes &bull; Sans engagement &bull; 100% gratuit</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top: 1px solid #e5e7eb; font-size: 0; height: 1px; line-height: 0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-padding" style="padding: 24px 30px; background-color: #f9fafb; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="text-align: center; padding-bottom: 12px;">
                    <span style="font-size: 16px; font-weight: 700; color: #064e3b;">Créa Entreprise</span>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-bottom: 12px;">
                    <p style="margin: 0; font-size: 11px; color: #9ca3af; line-height: 18px;">Georges Ernest Conseil, SAS<br />SIREN 830 693 032<br />crea-entreprise-rho.vercel.app</p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 8px;">
                    <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                      <a href="#" style="color: #6b7280; text-decoration: underline;">Se désabonner</a> &bull;
                      <a href="https://crea-entreprise-rho.vercel.app/mentions-legales" style="color: #6b7280; text-decoration: underline;">Mentions légales</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /Email Container -->

      </td>
    </tr>
  </table>
  <!-- /Wrapper -->

</body>
</html>`;

// ─── EMAIL 2: Professions Réglementées ─────────────────────────────

export const email2HTML = `<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Votre métier est réglementé</title>
  <style type="text/css">
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .hero-padding { padding: 24px 20px !important; }
      .content-padding { padding: 24px 20px !important; }
      .footer-padding { padding: 20px !important; }
      .hero-title { font-size: 22px !important; line-height: 30px !important; }
      .section-title { font-size: 18px !important; }
      .prof-grid { display: block !important; }
      .prof-cell { display: block !important; width: 100% !important; padding: 4px 0 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #fff1f2; font-family: Arial, Helvetica, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">

  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff1f2;">
    <tr>
      <td align="center" style="padding: 20px 10px;">

        <!-- Email Container 600px -->
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header / Logo -->
          <tr>
            <td style="background-color: #881337; padding: 20px 30px; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="text-align: center;">
                    <span style="font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">Créa Entreprise</span>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 4px;">
                    <span style="font-size: 11px; color: #fecdd3; letter-spacing: 2px; text-transform: uppercase;">Guides &bull; Outils &bull; Accompagnement</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Section -->
          <tr>
            <td class="hero-padding" style="background: linear-gradient(135deg, #be123c 0%, #e11d48 50%, #f43f5e 100%); padding: 40px 30px; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="text-align: center;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 16px auto;">
                      <tr>
                        <td style="background-color: rgba(255,255,255,0.2); border-radius: 20px; padding: 6px 16px;">
                          <span style="font-size: 13px; color: #ffffff; font-weight: 700; letter-spacing: 1px;">⚠ ALERTE RÉGLEMENTAIRE</span>
                        </td>
                      </tr>
                    </table>
                    <h1 class="hero-title" style="margin: 0 0 20px 0; font-size: 26px; font-weight: 700; color: #ffffff; line-height: 34px;">Votre métier est réglementé —<br />les démarches sont obligatoires</h1>
                    <p style="margin: 0; font-size: 15px; color: #ffe4e6; line-height: 24px;">Diplômes, autorisations, assurances spécifiques...<br />Un oubli peut coûter très cher.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Problem Section -->
          <tr>
            <td class="content-padding" style="padding: 32px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151; line-height: 24px;">Bonjour <strong>[Prénom]</strong>,</p>
                    <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151; line-height: 24px;">Saviez-vous que <strong>25 métiers en France</strong> nécessitent des démarches spécifiques avant de pouvoir exercer légalement ? Et si vous les ignorez, les conséquences peuvent être lourdes :</p>
                  </td>
                </tr>

                <!-- Warning Cards -->
                <tr>
                  <td style="padding-bottom: 12px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
                      <tr>
                        <td style="padding: 14px 18px;">
                          <p style="margin: 0; font-size: 14px; color: #991b1b; line-height: 20px;"><strong>Amendes jusqu'à 45 000€</strong> et 3 ans d'emprisonnement pour exercice illégal d'une activité réglementée</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding-bottom: 12px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fef2f2; border-radius: 8px; border-left: 4px solid #f97316;">
                      <tr>
                        <td style="padding: 14px 18px;">
                          <p style="margin: 0; font-size: 14px; color: #9a3412; line-height: 20px;"><strong>Assurance RC Pro refusée</strong> en cas d'activité exercée sans les qualifications requises</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fef2f2; border-radius: 8px; border-left: 4px solid #eab308;">
                      <tr>
                        <td style="padding: 14px 18px;">
                          <p style="margin: 0; font-size: 14px; color: #854d0e; line-height: 20px;"><strong>Fermeture administrative</strong> et interdiction d'exercer prononcée par les autorités de contrôle</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top: 1px solid #e5e7eb; font-size: 0; height: 1px; line-height: 0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- Professions Section -->
          <tr>
            <td class="content-padding" style="padding: 32px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 6px 0; font-size: 12px; color: #e11d48; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">MÉTIERS CONCERNÉS</p>
                    <h2 class="section-title" style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #111827;">Votre métier est-il dans la liste ?</h2>
                  </td>
                </tr>

                <!-- Professions Grid -->
                <tr>
                  <td>
                    <table role="presentation" class="prof-grid" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td class="prof-cell" width="50%" style="padding: 6px 8px 6px 0; vertical-align: top;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff1f2; border-radius: 6px;">
                            <tr><td style="padding: 10px 14px; font-size: 13px; color: #881337; font-weight: 600;">🏥  Médecin</td></tr>
                          </table>
                        </td>
                        <td class="prof-cell" width="50%" style="padding: 6px 0 6px 8px; vertical-align: top;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff1f2; border-radius: 6px;">
                            <tr><td style="padding: 10px 14px; font-size: 13px; color: #881337; font-weight: 600;">⚖️  Avocat</td></tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td class="prof-cell" width="50%" style="padding: 6px 8px 6px 0; vertical-align: top;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff1f2; border-radius: 6px;">
                            <tr><td style="padding: 10px 14px; font-size: 13px; color: #881337; font-weight: 600;">🍽️  Restaurateur</td></tr>
                          </table>
                        </td>
                        <td class="prof-cell" width="50%" style="padding: 6px 0 6px 8px; vertical-align: top;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff1f2; border-radius: 6px;">
                            <tr><td style="padding: 10px 14px; font-size: 13px; color: #881337; font-weight: 600;">🏠  Agent immobilier</td></tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td class="prof-cell" width="50%" style="padding: 6px 8px 6px 0; vertical-align: top;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff1f2; border-radius: 6px;">
                            <tr><td style="padding: 10px 14px; font-size: 13px; color: #881337; font-weight: 600;">🏗️  BTP Artisan</td></tr>
                          </table>
                        </td>
                        <td class="prof-cell" width="50%" style="padding: 6px 0 6px 8px; vertical-align: top;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff1f2; border-radius: 6px;">
                            <tr><td style="padding: 10px 14px; font-size: 13px; color: #881337; font-weight: 600;">✂️  Coiffeur</td></tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td class="prof-cell" width="50%" style="padding: 6px 8px 6px 0; vertical-align: top;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff1f2; border-radius: 6px;">
                            <tr><td style="padding: 10px 14px; font-size: 13px; color: #881337; font-weight: 600;">💪  Coach sportif</td></tr>
                          </table>
                        </td>
                        <td class="prof-cell" width="50%" style="padding: 6px 0 6px 8px; vertical-align: top;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff1f2; border-radius: 6px;">
                            <tr><td style="padding: 10px 14px; font-size: 13px; color: #881337; font-weight: 600;">🚗  Taxi / VTC</td></tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td class="prof-cell" width="50%" style="padding: 6px 8px 6px 0; vertical-align: top;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff1f2; border-radius: 6px;">
                            <tr><td style="padding: 10px 14px; font-size: 13px; color: #881337; font-weight: 600;">❤️  Infirmier</td></tr>
                          </table>
                        </td>
                        <td class="prof-cell" width="50%" style="padding: 6px 0 6px 8px; vertical-align: top;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff1f2; border-radius: 6px;">
                            <tr><td style="padding: 10px 14px; font-size: 13px; color: #881337; font-weight: 600;">🧮  Expert-comptable</td></tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td class="prof-cell" width="50%" style="padding: 6px 8px 6px 0; vertical-align: top;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff1f2; border-radius: 6px;">
                            <tr><td style="padding: 10px 14px; font-size: 13px; color: #881337; font-weight: 600;">💊  Pharmacien</td></tr>
                          </table>
                        </td>
                        <td class="prof-cell" width="50%" style="padding: 6px 0 6px 8px; vertical-align: top;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff1f2; border-radius: 6px;">
                            <tr><td style="padding: 10px 14px; font-size: 13px; color: #881337; font-weight: 600;">🐾  Vétérinaire</td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding-top: 16px;">
                    <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 20px; text-align: center;">...et 15 autres métiers. <a href="https://crea-entreprise-rho.vercel.app/metiers-reglementes" target="_blank" style="color: #e11d48; font-weight: 600;">Voir la liste complète →</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top: 1px solid #e5e7eb; font-size: 0; height: 1px; line-height: 0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- Solution Section -->
          <tr>
            <td class="content-padding" style="padding: 32px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 6px 0; font-size: 12px; color: #e11d48; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">NOTRE SOLUTION</p>
                    <h2 class="section-title" style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #111827;">Tout ce qu'il faut pour être en règle</h2>
                    <p style="margin: 0 0 20px 0; font-size: 14px; color: #6b7280; line-height: 22px;">Pour chaque métier réglementé, nous avons préparé :</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding-bottom: 14px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="32" valign="top" style="padding-right: 12px;">
                          <div style="width: 24px; height: 24px; background-color: #059669; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; color: #ffffff; font-weight: 700;">✓</div>
                        </td>
                        <td>
                          <p style="margin: 0; font-size: 14px; color: #374151; line-height: 20px;"><strong>Les diplômes et qualifications requises</strong> — listés par métier</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding-bottom: 14px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="32" valign="top" style="padding-right: 12px;">
                          <div style="width: 24px; height: 24px; background-color: #059669; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; color: #ffffff; font-weight: 700;">✓</div>
                        </td>
                        <td>
                          <p style="margin: 0; font-size: 14px; color: #374151; line-height: 20px;"><strong>Les autorisations et inscriptions obligatoires</strong> — avec liens directs</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding-bottom: 14px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="32" valign="top" style="padding-right: 12px;">
                          <div style="width: 24px; height: 24px; background-color: #059669; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; color: #ffffff; font-weight: 700;">✓</div>
                        </td>
                        <td>
                          <p style="margin: 0; font-size: 14px; color: #374151; line-height: 20px;"><strong>Les assurances obligatoires</strong> — RC Pro, décennale, etc.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="32" valign="top" style="padding-right: 12px;">
                          <div style="width: 24px; height: 24px; background-color: #059669; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; color: #ffffff; font-weight: 700;">✓</div>
                        </td>
                        <td>
                          <p style="margin: 0; font-size: 14px; color: #374151; line-height: 20px;"><strong>Un accompagnement juridique</strong> — documents et démarches <span style="color: #e11d48; font-weight: 700;">dès 29€ / document</span></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Audit Highlight -->
          <tr>
            <td style="padding: 0 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #881337, #9f1239); border-radius: 10px; overflow: hidden;">
                <tr>
                  <td style="padding: 28px 24px; text-align: center;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #fda4af; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">DEMANDEZ VOTRE AUDIT GRATUIT</p>
                    <p style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #ffffff; line-height: 26px;">Notre audit détecte automatiquement<br />si votre secteur est réglementé</p>
                    <p style="margin: 0 0 18px 0; font-size: 14px; color: #fecdd3; line-height: 20px;">Et vous oriente vers les démarches exactes à suivre</p>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                      <tr>
                        <td align="center" style="background-color: #ffffff; border-radius: 8px;">
                          <a href="https://crea-entreprise-rho.vercel.app/metiers-reglementes" target="_blank" style="display: inline-block; padding: 14px 36px; font-size: 15px; font-weight: 700; color: #881337; text-decoration: none; border-radius: 8px; background-color: #ffffff;">Vérifier les démarches pour mon métier →</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Spacing -->
          <tr><td style="height: 24px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

          <!-- CTA Section -->
          <tr>
            <td style="padding: 0 30px 32px 30px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">Audit personnalisé en 2 minutes &bull; Sans engagement &bull; 100% gratuit</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top: 1px solid #e5e7eb; font-size: 0; height: 1px; line-height: 0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-padding" style="padding: 24px 30px; background-color: #f9fafb; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="text-align: center; padding-bottom: 12px;">
                    <span style="font-size: 16px; font-weight: 700; color: #881337;">Créa Entreprise</span>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-bottom: 12px;">
                    <p style="margin: 0; font-size: 11px; color: #9ca3af; line-height: 18px;">Georges Ernest Conseil, SAS<br />SIREN 830 693 032<br />crea-entreprise-rho.vercel.app</p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 8px;">
                    <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                      <a href="#" style="color: #6b7280; text-decoration: underline;">Se désabonner</a> &bull;
                      <a href="https://crea-entreprise-rho.vercel.app/mentions-legales" style="color: #6b7280; text-decoration: underline;">Mentions légales</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /Email Container -->

      </td>
    </tr>
  </table>
  <!-- /Wrapper -->

</body>
</html>`;

// ─── EMAIL 3: Consultants & Experts B2B ────────────────────────────

export const email3HTML = `<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Générer 10+ leads B2B par mois</title>
  <style type="text/css">
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .hero-padding { padding: 24px 20px !important; }
      .content-padding { padding: 24px 20px !important; }
      .footer-padding { padding: 20px !important; }
      .hero-title { font-size: 22px !important; line-height: 30px !important; }
      .section-title { font-size: 18px !important; }
      .stat-cell { display: block !important; width: 100% !important; padding: 8px 0 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #faf5ff; font-family: Arial, Helvetica, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">

  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #faf5ff;">
    <tr>
      <td align="center" style="padding: 20px 10px;">

        <!-- Email Container 600px -->
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header / Logo -->
          <tr>
            <td style="background-color: #4c1d95; padding: 20px 30px; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="text-align: center;">
                    <span style="font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">Créa Entreprise</span>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 4px;">
                    <span style="font-size: 11px; color: #c4b5fd; letter-spacing: 2px; text-transform: uppercase;">Guides &bull; Outils &bull; Accompagnement</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Section -->
          <tr>
            <td class="hero-padding" style="background: linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 16px 0; font-size: 14px; color: #ddd6fe; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">LEAD GENERATION B2B</p>
                    <h1 class="hero-title" style="margin: 0 0 20px 0; font-size: 26px; font-weight: 700; color: #ffffff; line-height: 34px;">Comment générer 10+ leads qualifiés B2B par mois — sans recruter</h1>
                    <p style="margin: 0; font-size: 15px; color: #ede9fe; line-height: 24px;">La méthode que nos consultants utilisent pour scaler leur activité</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Problem Section -->
          <tr>
            <td class="content-padding" style="padding: 32px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151; line-height: 24px;">Bonjour <strong>[Prénom]</strong>,</p>
                    <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151; line-height: 24px;">Si vous êtes consultant, expert ou prestataire B2B, vous connaissez probablement cette réalité :</p>
                  </td>
                </tr>

                <!-- Pain Points -->
                <tr>
                  <td style="padding-bottom: 10px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #faf5ff; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                      <tr>
                        <td style="padding: 12px 18px;">
                          <p style="margin: 0; font-size: 14px; color: #374151; line-height: 20px;">Votre réseau se tarit et les recommandations ne suffisent plus pour remplir votre pipeline</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding-bottom: 10px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #faf5ff; border-radius: 8px; border-left: 4px solid #a78bfa;">
                      <tr>
                        <td style="padding: 12px 18px;">
                          <p style="margin: 0; font-size: 14px; color: #374151; line-height: 20px;">Vos prospects ne répondent plus aux emails froids et aux messages LinkedIn génériques</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #faf5ff; border-radius: 8px; border-left: 4px solid #c4b5fd;">
                      <tr>
                        <td style="padding: 12px 18px;">
                          <p style="margin: 0; font-size: 14px; color: #374151; line-height: 20px;">Recruter un commercial coûte 3 000€+ par mois — et les résultats ne sont jamais garantis</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding-top: 20px;">
                    <p style="margin: 0; font-size: 15px; color: #374151; line-height: 24px;">Et si on vous disait qu'il existe un <strong>parcours testé et validé</strong> pour générer des leads B2B qualifiés, de manière <strong>prévisible et scalable</strong> ?</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top: 1px solid #e5e7eb; font-size: 0; height: 1px; line-height: 0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- Parcours Section -->
          <tr>
            <td class="content-padding" style="padding: 32px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 6px 0; font-size: 12px; color: #7c3aed; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">PARCOURS CONSULTANT B2B</p>
                    <h2 class="section-title" style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #111827;">5 étapes pour un pipeline B2B prévisible</h2>
                  </td>
                </tr>

                <!-- Step 1 -->
                <tr>
                  <td style="padding-bottom: 12px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #faf5ff; border-radius: 8px; border-left: 4px solid #7c3aed;">
                      <tr>
                        <td style="padding: 12px 18px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="36" valign="top" style="padding-right: 10px;">
                                <div style="width: 28px; height: 28px; background-color: #7c3aed; border-radius: 6px; text-align: center; line-height: 28px; font-size: 13px; font-weight: 700; color: #ffffff;">1</div>
                              </td>
                              <td>
                                <p style="margin: 0 0 2px 0; font-size: 14px; font-weight: 700; color: #4c1d95;">Business Plan Stratégique</p>
                                <p style="margin: 0; font-size: 13px; color: #374151; line-height: 19px;">Positionnement, offre, segmentation — les fondations qui font la différence.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Step 2 -->
                <tr>
                  <td style="padding-bottom: 12px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #faf5ff; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                      <tr>
                        <td style="padding: 12px 18px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="36" valign="top" style="padding-right: 10px;">
                                <div style="width: 28px; height: 28px; background-color: #8b5cf6; border-radius: 6px; text-align: center; line-height: 28px; font-size: 13px; font-weight: 700; color: #ffffff;">2</div>
                              </td>
                              <td>
                                <p style="margin: 0 0 2px 0; font-size: 14px; font-weight: 700; color: #4c1d95;">LinkedIn Pro</p>
                                <p style="margin: 0; font-size: 13px; color: #374151; line-height: 19px;">Optimisation profil, stratégie de contenu, networking ciblé — devenez une référence.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Step 3 -->
                <tr>
                  <td style="padding-bottom: 12px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #faf5ff; border-radius: 8px; border-left: 4px solid #a78bfa;">
                      <tr>
                        <td style="padding: 12px 18px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="36" valign="top" style="padding-right: 10px;">
                                <div style="width: 28px; height: 28px; background-color: #a78bfa; border-radius: 6px; text-align: center; line-height: 28px; font-size: 13px; font-weight: 700; color: #4c1d95;">3</div>
                              </td>
                              <td>
                                <p style="margin: 0 0 2px 0; font-size: 14px; font-weight: 700; color: #4c1d95;">Lead Gen B2B</p>
                                <p style="margin: 0; font-size: 13px; color: #374151; line-height: 19px;">Prospection automatisée, séquences email, scoring — des leads qualifiés chaque semaine.</p>
                                <p style="margin: 4px 0 0 0; font-size: 12px; color: #7c3aed; font-weight: 600;">Service dédié dès 279€ / mois</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Step 4 -->
                <tr>
                  <td style="padding-bottom: 12px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #faf5ff; border-radius: 8px; border-left: 4px solid #c4b5fd;">
                      <tr>
                        <td style="padding: 12px 18px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="36" valign="top" style="padding-right: 10px;">
                                <div style="width: 28px; height: 28px; background-color: #c4b5fd; border-radius: 6px; text-align: center; line-height: 28px; font-size: 13px; font-weight: 700; color: #4c1d95;">4</div>
                              </td>
                              <td>
                                <p style="margin: 0 0 2px 0; font-size: 14px; font-weight: 700; color: #4c1d95;">Copilote Entreprise</p>
                                <p style="margin: 0; font-size: 13px; color: #374151; line-height: 19px;">Suivi mensuel avec un expert — stratégie, cash-flow, croissance.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Step 5 -->
                <tr>
                  <td>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #faf5ff; border-radius: 8px; border-left: 4px solid #ddd6fe;">
                      <tr>
                        <td style="padding: 12px 18px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="36" valign="top" style="padding-right: 10px;">
                                <div style="width: 28px; height: 28px; background-color: #ddd6fe; border-radius: 6px; text-align: center; line-height: 28px; font-size: 13px; font-weight: 700; color: #4c1d95;">5</div>
                              </td>
                              <td>
                                <p style="margin: 0 0 2px 0; font-size: 14px; font-weight: 700; color: #4c1d95;">DAF Externalisé</p>
                                <p style="margin: 0; font-size: 13px; color: #374151; line-height: 19px;">Gestion financière optimisée — trésorerie, facturation, prévisions.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Social Proof Bar -->
          <tr>
            <td style="padding: 0 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #faf5ff; border-radius: 10px; border: 1px solid #ede9fe;">
                <tr>
                  <td style="padding: 20px 16px;">
                    <table role="presentation" class="stat-cell" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="33%" style="text-align: center; padding: 4px;">
                          <p style="margin: 0 0 2px 0; font-size: 24px; font-weight: 700; color: #7c3aed;">500+</p>
                          <p style="margin: 0; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Entrepreneurs<br />accompagnés</p>
                        </td>
                        <td width="34%" style="text-align: center; padding: 4px;">
                          <p style="margin: 0 0 2px 0; font-size: 24px; font-weight: 700; color: #7c3aed;">4.8/5</p>
                          <p style="margin: 0; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Satisfaction<br />client</p>
                        </td>
                        <td width="33%" style="text-align: center; padding: 4px;">
                          <p style="margin: 0 0 2px 0; font-size: 24px; font-weight: 700; color: #7c3aed;">10+</p>
                          <p style="margin: 0; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Leads B2B<br />/ mois en moyenne</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Spacing -->
          <tr><td style="height: 24px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

          <!-- Pack Highlight -->
          <tr>
            <td style="padding: 0 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #4c1d95, #6d28d9); border-radius: 10px; overflow: hidden;">
                <tr>
                  <td style="padding: 28px 24px; text-align: center;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #c4b5fd; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">PACK CROISSANCE — RECOMMANDÉ</p>
                    <p style="margin: 0 0 12px 0; font-size: 32px; font-weight: 700; color: #ffffff;">5 390€</p>
                    <p style="margin: 0 0 16px 0; font-size: 14px; color: #ddd6fe; line-height: 20px;">Business Plan + LinkedIn Pro + Lead Gen 6 mois + Copilote 6 mois + DAF 3 mois<br />Le tout intégré pour maximiser votre croissance B2B</p>
                    <p style="margin: 0; font-size: 12px; color: #c4b5fd;">Ou un service Lead Gen B2B standalone dès 279€ / mois</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Spacing -->
          <tr><td style="height: 24px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

          <!-- CTA Section -->
          <tr>
            <td style="padding: 0 30px 32px 30px; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 0 20px;">
                    <p style="margin: 0 0 20px 0; font-size: 15px; color: #374151; line-height: 24px; text-align: center;"><strong>Prêt(e) à transformer votre prospection ?</strong><br />Réservez votre audit stratégique gratuit et obtenez un plan d'action personnalisé.</p>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="background-color: #7c3aed; border-radius: 8px;">
                          <a href="https://crea-entreprise-rho.vercel.app/#audit" target="_blank" style="display: inline-block; padding: 16px 40px; font-size: 16px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 8px; background-color: #7c3aed;">Réserver mon audit stratégique gratuit →</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 12px; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #9ca3af;">Résultats en 2 minutes &bull; Sans engagement &bull; 100% gratuit</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top: 1px solid #e5e7eb; font-size: 0; height: 1px; line-height: 0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-padding" style="padding: 24px 30px; background-color: #f9fafb; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="text-align: center; padding-bottom: 12px;">
                    <span style="font-size: 16px; font-weight: 700; color: #4c1d95;">Créa Entreprise</span>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-bottom: 12px;">
                    <p style="margin: 0; font-size: 11px; color: #9ca3af; line-height: 18px;">Georges Ernest Conseil, SAS<br />SIREN 830 693 032<br />crea-entreprise-rho.vercel.app</p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 8px;">
                    <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                      <a href="#" style="color: #6b7280; text-decoration: underline;">Se désabonner</a> &bull;
                      <a href="https://crea-entreprise-rho.vercel.app/mentions-legales" style="color: #6b7280; text-decoration: underline;">Mentions légales</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /Email Container -->

      </td>
    </tr>
  </table>
  <!-- /Wrapper -->

</body>
</html>`;
