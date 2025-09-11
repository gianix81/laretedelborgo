import React from 'react';
import { X, Phone, Mail, MapPin, Clock, MessageCircle, Globe, Facebook, Instagram, Twitter } from 'lucide-react';

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactsModal: React.FC<ContactsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Telefono',
      value: '+39 02 1234 5678',
      description: 'Lun-Ven 9:00-18:00',
      action: () => window.open('tel:+390212345678')
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      value: 'info@laretedelborgo.it',
      description: 'Risposta entro 24h',
      action: () => window.open('mailto:info@laretedelborgo.it')
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'WhatsApp',
      value: '+39 333 123 4567',
      description: 'Chat diretta',
      action: () => window.open('https://wa.me/393331234567')
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Sito Web',
      value: 'www.laretedelborgo.it',
      description: 'Informazioni complete',
      action: () => window.open('https://www.laretedelborgo.it')
    }
  ];

  const socialLinks = [
    {
      icon: <Facebook className="w-5 h-5" />,
      name: 'Facebook',
      url: 'https://facebook.com/laretedelborgo',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      icon: <Instagram className="w-5 h-5" />,
      name: 'Instagram',
      url: 'https://instagram.com/laretedelborgo',
      color: 'bg-pink-600 hover:bg-pink-700'
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      name: 'Twitter',
      url: 'https://twitter.com/laretedelborgo',
      color: 'bg-blue-400 hover:bg-blue-500'
    }
  ];

  const officeHours = [
    { day: 'Lunedì - Venerdì', hours: '9:00 - 18:00' },
    { day: 'Sabato', hours: '9:00 - 13:00' },
    { day: 'Domenica', hours: 'Chiuso' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full h-full sm:max-w-4xl sm:w-full sm:max-h-[90vh] sm:h-auto overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Contatti</h2>
              <p className="text-orange-100 text-sm sm:text-base">Siamo qui per aiutarti</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Contact Methods */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                onClick={method.action}
                className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 sm:p-6 cursor-pointer transition-colors group"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center text-orange-600 transition-colors">
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{method.title}</h3>
                    <p className="text-orange-600 font-medium mb-1 text-sm sm:text-base break-all sm:break-normal">{method.value}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Office Hours */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                Orari di Ufficio
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="space-y-3">
                  {officeHours.map((schedule, index) => (
                    <div key={index} className="flex items-center justify-between text-sm sm:text-base">
                      <span className="text-gray-700 font-medium">{schedule.day}</span>
                      <span className="text-gray-600">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                Sede Legale
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="space-y-2">
                  <p className="font-medium text-gray-900 text-sm sm:text-base">La Rete del Borgo S.r.l.</p>
                  <p className="text-gray-700 text-sm sm:text-base">Via Roma 123</p>
                  <p className="text-gray-700 text-sm sm:text-base">20121 Milano (MI)</p>
                  <p className="text-gray-700 text-sm sm:text-base">Italia</p>
                </div>
                <button
                  onClick={() => window.open('https://maps.google.com/?q=Via+Roma+123,+Milano')}
                  className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                >
                  Visualizza su Maps
                </button>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="mt-6 sm:mt-8">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Seguici sui Social</h3>
            <div className="flex gap-3 sm:gap-4">
              {socialLinks.map((social, index) => (
                <button
                  key={index}
                  onClick={() => window.open(social.url, '_blank')}
                  className={`${social.color} text-white p-2.5 sm:p-3 rounded-lg transition-colors flex items-center justify-center`}
                  title={social.name}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-6 sm:mt-8">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Domande Frequenti</h3>
            <div className="space-y-4">
              <details className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <summary className="font-medium text-gray-900 cursor-pointer text-sm sm:text-base">
                  Come posso registrare la mia attività?
                </summary>
                <p className="text-gray-600 mt-2 text-xs sm:text-sm">
                  Clicca su "Registra Attività" nell'header, compila il modulo di registrazione e attendi l'approvazione del nostro team entro 24 ore.
                </p>
              </details>
              
              <details className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <summary className="font-medium text-gray-900 cursor-pointer text-sm sm:text-base">
                  Quanto costa utilizzare la piattaforma?
                </summary>
                <p className="text-gray-600 mt-2 text-xs sm:text-sm">
                  Il primo mese è gratuito, poi €2/mese per il piano base. Il piano Professionista costa €10/mese con funzionalità avanzate.
                </p>
              </details>
              
              <details className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <summary className="font-medium text-gray-900 cursor-pointer text-sm sm:text-base">
                  Come funziona la geolocalizzazione?
                </summary>
                <p className="text-gray-600 mt-2 text-xs sm:text-sm">
                  Attiva i permessi di localizzazione nel tuo browser per vedere le attività ordinate per distanza e ottenere indicazioni stradali precise.
                </p>
              </details>
            </div>
          </div>

          {/* Contact Form */}
          <div className="mt-6 sm:mt-8 bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Invia un Messaggio</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Nome</label>
                  <input
                    type="text"
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
                    placeholder="Il tuo nome"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
                    placeholder="la-tua-email@esempio.it"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Oggetto</label>
                <input
                  type="text"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
                  placeholder="Oggetto del messaggio"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Messaggio</label>
                <textarea
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
                  placeholder="Scrivi il tuo messaggio..."
                />
              </div>
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
              >
                Invia Messaggio
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsModal;