import { useState } from "react";
import { useParams } from "react-router-dom";
import { Header, SideBar, Footer } from "../../components";
import { ArrowLeftIcon, ArrowRightIcon } from "../../assets/Review";
import { useToast } from "../../components/ToastProvider.jsx";

export default function FlashcardReviewPage() {
  const { listId } = useParams();
  const toast = useToast();

  const dummyWords = [
    { id: 1, word: "apple", meaning: "quả táo" },
    { id: 2, word: "dog", meaning: "con chó" },
    { id: 3, word: "computer", meaning: "máy tính" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  const currentWord = dummyWords[currentIndex];

  const handleFlip = () => setShowMeaning(!showMeaning);

  const handlePrevious = () => {
    setShowMeaning(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    setShowMeaning(false);
    if (currentIndex < dummyWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast("Đã hết từ!", "success");
    }
  };

  return (
    <div className="flashcard">
      <Header />
      <h1 className="flashcard__title">Review with Spaced Repetition</h1>
      <SideBar />

      <div className="flashcard__content">
        <div className="flashcard__card">
          <button className="flashcard__prev" onClick={handlePrevious}>
            <img src={ArrowLeftIcon} alt="Previous" className="flashcard__icon" />
          </button>

          <div className="flashcard__animation" onClick={handleFlip}>
            <div className={`card__inner ${showMeaning ? "is-flipped" : ""}`}>
              <div className="card__face card__front">
                {currentWord.word}
              </div>
              <div className="card__face card__back">
                {currentWord.meaning}
              </div>
            </div>
          </div>

          <button className="flashcard__next" onClick={handleNext}>
            <img src={ArrowRightIcon} alt="Next" className="flashcard__icon" />
          </button>
        </div>

        <div className="flashcard__controls">
          <button className='know'>Unknow</button>
          <button className='unknow'>Know</button>
        </div>
      </div>

      <div className="flashcard__submit">
        <button className="flashcard__submit-button">Finish</button>
      </div>

      <Footer />
    </div>
  );
}
