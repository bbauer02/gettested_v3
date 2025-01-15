const mockJapaneseN5Questions = [
  // Vocabulaire de base - Salutations et présentation
  {
    label: "N5-Vocabulary-1",
    instruction: "<p>基本的な挨拶と自己紹介</p>",
    timemax: 30,
    point: 5,
    test: {
      test_id: 2,
      label: "JLPT"
    },
    level: {
      level_id: 5,
      label: "N5"
    },
    type: "MCQ",
    question: {
      text: "おはようございます。これは何の挨拶ですか？",
      choices: [
        { text: "朝の挨拶", isCorrect: true },
        { text: "夜の挨拶", isCorrect: false },
        { text: "別れの挨拶", isCorrect: false },
        { text: "食事の挨拶", isCorrect: false }
      ]
    }
  },

  // Grammaire de base - Particules は et が
  {
    label: "N5-Grammar-1",
    instruction: "<p>助詞「は」と「が」の使い方</p>",
    timemax: 45,
    point: 8,
    test: {
      test_id: 2,
      label: "JLPT"
    },
    level: {
      level_id: 5,
      label: "N5"
    },
    type: "FillInTheBlanks",
    question: {
      text: "私___ 学生です。私___ ペンを持っています。",
      answers: ["は", "が"]
    }
  },

  // Nombres et compteurs
  {
    label: "N5-Numbers-1",
    instruction: "<p>数字と助数詞</p>",
    timemax: 40,
    point: 6,
    test: {
      test_id: 2,
      label: "JLPT"
    },
    level: {
      level_id: 5,
      label: "N5"
    },
    type: "MCQ",
    question: {
      text: "リンゴを三つ買います。何個買いますか？",
      choices: [
        { text: "3個", isCorrect: true },
        { text: "2個", isCorrect: false },
        { text: "4個", isCorrect: false },
        { text: "1個", isCorrect: false }
      ]
    }
  },

  // Verbes - Forme en て
  {
    label: "N5-Verbs-1",
    instruction: "<p>動詞のて形</p>",
    timemax: 50,
    point: 10,
    test: {
      test_id: 2,
      label: "JLPT"
    },
    level: {
      level_id: 5,
      label: "N5"
    },
    type: "UCQ",
    question: {
      text: "食べる → て形は？",
      choices: [
        { text: "食べて", isCorrect: true },
        { text: "食べた", isCorrect: false },
        { text: "食べる", isCorrect: false },
        { text: "食べろ", isCorrect: false }
      ]
    }
  },

  // Kana - Hiragana
  {
    label: "N5-Kana-1",
    instruction: "<p>ひらがなを読む</p>",
    timemax: 30,
    point: 5,
    test: {
      test_id: 2,
      label: "JLPT"
    },
    level: {
      level_id: 5,
      label: "N5"
    },
    type: "Highlight",
    question: {
      text: "あめがふっています。かさをもっていきましょう。",
      answers: ["あめ", "かさ"]
    }
  },

  // Kanji de base
  {
    label: "N5-Kanji-1",
    instruction: "<p>基本的な漢字の読み方</p>",
    timemax: 35,
    point: 7,
    test: {
      test_id: 2,
      label: "JLPT"
    },
    level: {
      level_id: 5,
      label: "N5"
    },
    type: "MCQ",
    question: {
      text: "「木」の読み方として正しいものはどれですか？",
      choices: [
        { text: "き", isCorrect: true },
        { text: "もく", isCorrect: true },
        { text: "ぎ", isCorrect: false },
        { text: "こ", isCorrect: false }
      ]
    }
  },

  // Expressions quotidiennes
  {
    label: "N5-Daily-1",
    instruction: "<p>日常表現</p>",
    timemax: 40,
    point: 6,
    test: {
      test_id: 2,
      label: "JLPT"
    },
    level: {
      level_id: 5,
      label: "N5"
    },
    type: "TrueFalse",
    question: {
      text: "「いただきます」は食事の後に言う言葉です。",
      answer: false
    }
  },

  // Adjectifs
  {
    label: "N5-Adjectives-1",
    instruction: "<p>形容詞の活用</p>",
    timemax: 45,
    point: 8,
    test: {
      test_id: 2,
      label: "JLPT"
    },
    level: {
      level_id: 5,
      label: "N5"
    },
    type: "FillInTheBlanks",
    question: {
      text: "この本は___です。でも、あの本は___くないです。",
      answers: ["おもしろい", "おもしろ"]
    }
  },

  // Compréhension - Situations simples
  {
    label: "N5-Comprehension-1",
    instruction: "<p>簡単な状況での会話理解</p>",
    timemax: 60,
    point: 10,
    test: {
      test_id: 2,
      label: "JLPT"
    },
    level: {
      level_id: 5,
      label: "N5"
    },
    type: "UCQ",
    question: {
      text: "A: すみません、トイレはどこですか。\nB: あそこです。\nAさんは何を探していますか？",
      choices: [
        { text: "トイレの場所", isCorrect: true },
        { text: "駅の場所", isCorrect: false },
        { text: "店の場所", isCorrect: false },
        { text: "出口の場所", isCorrect: false }
      ]
    }
  },

  // Questions sur l'heure
  {
    label: "N5-Time-1",
    instruction: "<p>時間の表現</p>",
    timemax: 40,
    point: 7,
    test: {
      test_id: 2,
      label: "JLPT"
    },
    level: {
      level_id: 5,
      label: "N5"
    },
    type: "MCQ",
    question: {
      text: "今は午後3時30分です。何時半ですか？",
      choices: [
        { text: "15時30分", isCorrect: true },
        { text: "3時30分", isCorrect: true },
        { text: "13時30分", isCorrect: false },
        { text: "3時", isCorrect: false }
      ]
    }
  }
  // ... Répéter des variations similaires pour atteindre 200 questions
];

// Structure pour organiser les questions par catégorie
const N5Categories = {
  GRAMMAR: [
    "Particules は/が/を/に/で",
    "Verbes forme normale",
    "Verbes forme て",
    "Verbes forme た",
    "Adjectifs い/な",
    "です/ます",
    "Question か"
  ],
  VOCABULARY: [
    "Salutations",
    "Vie quotidienne",
    "Famille",
    "Nombres",
    "Temps/Date",
    "Lieux",
    "Nourriture"
  ],
  KANJI: [
    "Kanji de base (80 kanji N5)",
    "Lectures on/kun",
    "Composés simples"
  ],
  COMPREHENSION: [
    "Dialogues simples",
    "Textes courts",
    "Panneaux et indications",
    "Messages brefs"
  ]
};

export { mockJapaneseN5Questions, N5Categories };
