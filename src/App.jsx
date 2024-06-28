import React, { useState, useEffect, useRef } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './App.css';

// Quiz data intégré
const quizData = [
    {
      question: "Comment vous sentez-vous aujourd'hui ?",
      options: ["Bien", "Pas très bien", "Très mal"],
      responses: [
        "C'est super ! Continuez à prendre soin de vous.",
        "Je suis désolé d'entendre ça. Pouvez-vous me décrire vos symptômes ?",
        "Je suis vraiment désolé que vous vous sentiez si mal. Voulez-vous que je vous mette en contact avec un professionnel de santé ?"
      ]
    },
    {
      question: "Avez-vous de la fièvre ?",
      options: ["Oui", "Non", "Je ne suis pas sûr"],
      responses: [
        "La fièvre peut être un signe d'infection. Depuis combien de temps avez-vous de la fièvre ?",
        "C'est bon signe. Avez-vous d'autres symptômes ?",
        "Il serait utile de prendre votre température. Avez-vous un thermomètre à la maison ?"
      ]
    },
    {
      question: "Ressentez-vous de l'anxiété ou du stress ?",
      options: ["Oui, beaucoup", "Un peu", "Non, pas vraiment"],
      responses: [
        "Je comprends que cette situation puisse être stressante. Voulez-vous que je vous donne quelques techniques de relaxation ?",
        "C'est normal de ressentir un peu d'anxiété. Essayez de prendre de profondes respirations et de vous concentrer sur des pensées positives.",
        "C'est bien que vous vous sentiez calme. Continuez à prendre soin de votre santé mentale autant que de votre santé physique."
      ]
    },
    {
      question: "Avez-vous des difficultés à respirer ?",
      options: ["Oui", "Un peu", "Non"],
      responses: [
        "Des difficultés respiratoires peuvent être sérieuses. Je vous recommande de consulter un médecin rapidement.",
        "Surveillez attentivement ce symptôme. Si cela s'aggrave, n'hésitez pas à consulter un médecin.",
        "C'est rassurant. Continuez à surveiller vos symptômes et n'hésitez pas à me tenir informé de tout changement."
      ]
    },
    {
      question: "Avez-vous perdu le goût ou l'odorat récemment ?",
      options: ["Oui", "Non", "Je ne suis pas sûr"],
      responses: [
        "La perte du goût ou de l'odorat peut être un symptôme de certaines infections. Il serait prudent de vous isoler et de consulter un médecin.",
        "C'est un bon signe. Continuez à surveiller vos symptômes.",
        "Essayez de faire un test simple, comme sentir du café ou goûter quelque chose de fort. Si vous avez des doutes, il vaut mieux consulter."
      ]
    },
    {
      question: "Avez-vous été en contact avec quelqu'un qui a été testé positif au COVID-19 ?",
      options: ["Oui", "Non", "Je ne suis pas sûr"],
      responses: [
        "Il est recommandé de vous isoler et de vous faire tester. Voulez-vous que je vous donne des informations sur les centres de test près de chez vous ?",
        "C'est rassurant. Continuez néanmoins à suivre les mesures de précaution recommandées.",
        "Par précaution, il serait sage de limiter vos contacts et de surveiller l'apparition de symptômes. N'hésitez pas à vous faire tester au moindre doute."
      ]
    },
    {
      question: "Comment est votre sommeil ces derniers temps ?",
      options: ["Bon", "Perturbé", "Très mauvais"],
      responses: [
        "Un bon sommeil est essentiel pour la santé. Continuez à maintenir une bonne hygiène de sommeil.",
        "Un sommeil perturbé peut affecter votre santé. Avez-vous essayé des techniques de relaxation avant de dormir ?",
        "Un mauvais sommeil peut avoir un impact significatif sur votre santé. Voulez-vous que je vous donne quelques conseils pour améliorer votre sommeil ?"
      ]
    },
    {
      question: "Comment décririez-vous votre niveau d'énergie ?",
      options: ["Normal", "Fatigué", "Épuisé"],
      responses: [
        "C'est bien que vous vous sentiez en forme. Continuez à prendre soin de vous.",
        "La fatigue peut être due à de nombreux facteurs. Assurez-vous de bien vous reposer et de manger équilibré.",
        "Un épuisement constant peut être le signe d'un problème de santé. Il serait peut-être bon d'en parler à un médecin."
      ]
    },
    {
      question: "Avez-vous des douleurs musculaires ou articulaires ?",
      options: ["Oui", "Un peu", "Non"],
      responses: [
        "Des douleurs persistantes méritent attention. Avez-vous essayé des étirements doux ou des applications de chaleur ?",
        "Des douleurs légères peuvent souvent être soulagées par du repos et des exercices doux. Si elles persistent, consultez un médecin.",
        "C'est bien que vous n'ayez pas de douleurs. L'exercice régulier peut aider à maintenir cette condition."
      ]
    },
    {
      question: "Comment est votre appétit ces derniers jours ?",
      options: ["Normal", "Diminué", "Augmenté"],
      responses: [
        "Un appétit normal est un bon signe. Continuez à maintenir une alimentation équilibrée.",
        "Une perte d'appétit peut être due au stress ou à une maladie. Essayez de manger de petits repas fréquents et nutritifs.",
        "Une augmentation de l'appétit peut être normale, mais si elle est accompagnée d'autres symptômes, il serait bon d'en parler à un médecin."
      ]
    }
  ];;

function App() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (messages.length === 0) {
            addMessage('bot', "Bonjour ! Je suis là pour discuter avec vous et vous aider à vous sentir mieux. Voulez-vous commencer le questionnaire ?");
        }
    }, []);

    const addMessage = (sender, text, options = null) => {
        setMessages(prevMessages => [...prevMessages, { sender, text, options }]);
    };

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            addMessage('user', inputMessage);
            setInputMessage('');
            processUserInput(inputMessage);
        }
    };

    const processUserInput = (input) => {
        const lowercaseInput = input.toLowerCase();

        if (!quizStarted) {
            if (lowercaseInput.includes('oui')) {
                setQuizStarted(true);
                askNextQuestion();
            } else {
                addMessage('bot', "D'accord, n'hésitez pas à me dire quand vous voulez commencer le questionnaire.");
            }
            return;
        }

        const currentQuiz = quizData[currentQuizIndex];

        if (currentQuiz) {
            const matchedOptionIndex = currentQuiz.options.findIndex(option => 
                lowercaseInput.includes(option.toLowerCase())
            );

            if (matchedOptionIndex !== -1) {
                addMessage('bot', currentQuiz.responses[matchedOptionIndex]);
                setCurrentQuizIndex(prevIndex => {
                    const newIndex = prevIndex + 1;
                    if (newIndex < quizData.length) {
                        setTimeout(() => {
                            askNextQuestion();
                        }, 1000);
                    } else {
                        setTimeout(() => {
                            addMessage('bot', "Merci pour vos réponses. Souhaitez-vous parler à un professionnel de santé ? Je peux vous mettre en contact si vous le désirez.");
                        }, 1000);
                    }
                    return newIndex;
                });
            } else {
                addMessage('bot', "Je n'ai pas bien compris votre réponse. Pouvez-vous choisir parmi les options proposées ?");
            }
        } else if (lowercaseInput.includes('oui') && messages[messages.length - 1].text.includes("professionnel de santé")) {
            addMessage('bot', "D'accord, voici un numéro que vous pouvez appeler : 01 23 45 67 89. Ou vous pouvez utiliser ce lien WhatsApp : [lien WhatsApp]");
        } else {
            addMessage('bot', "Je comprends. N'hésitez pas à me poser d'autres questions si vous en avez.");
        }
    };

    const askNextQuestion = () => {
        if (currentQuizIndex < quizData.length) {
            const nextQuiz = quizData[currentQuizIndex];
            addMessage('bot', nextQuiz.question, nextQuiz.options);
        }
    };

    const handleRecordAudio = () => {
        setIsRecording(!isRecording);
        if (!isRecording) {
            setTimeout(() => {
                addMessage('user', '🎤 Audio message');
                setIsRecording(false);
                processUserInput('Audio message');
            }, 3000);
        }
    };

    const handlePlayAudio = (text) => {
        if (currentAudio && currentAudio.text === text) {
            if (speechSynthesis.speaking) {
                speechSynthesis.pause();
            } else {
                speechSynthesis.resume();
            }
        } else {
            if (currentAudio) {
                speechSynthesis.cancel();
            }
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.text = text;
            speechSynthesis.speak(utterance);
            setCurrentAudio(utterance);
        }
    };

    return (
        <div className="app-container">
            <Button className="ui button" icon labelPosition="right" onClick={() => setOpen(true)}>
                Ouvrir le Chat Santé
                <Icon name="heartbeat" />
            </Button>
            <Popup open={open} onClose={() => setOpen(false)} modal nested>
                {close => (
                    <div className="chat-modal">
                        <button className="close-button" onClick={close}>
                            &times;
                        </button>
                        <div className="chat-header">
                            <Icon name="user doctor" />
                            <span>Assistant Santé</span>
                        </div>
                        <div className="chat-content">
                            <div className="chat-messages">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`message ${msg.sender}`}>
                                        <p>{msg.text}</p>
                                        {msg.sender === 'bot' && msg.options && (
                                            <div className="message-options">
                                                {msg.options.map((option, optionIndex) => (
                                                    <button key={optionIndex} onClick={() => processUserInput(option)}>
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {msg.sender === 'bot' && (
                                            <div className="audio-controls">
                                                <Icon 
                                                    name={currentAudio && currentAudio.text === msg.text && speechSynthesis.speaking ? "pause" : "play"}
                                                    className={`icon ${currentAudio && currentAudio.text === msg.text && speechSynthesis.speaking ? "pause-icon" : "play-icon"}`}
                                                    onClick={() => handlePlayAudio(msg.text)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>
                            <div className="chat-input">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Tapez votre message..."
                                />
                                <button onClick={handleRecordAudio}>
                                    <Icon name={isRecording ? 'stop' : 'microphone'} />
                                </button>
                                <button onClick={handleSendMessage}>
                                    <Icon name="send" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Popup>
        </div>
    );
}

export default App;
