// Story content. Plain script (not JSON) so index.html works from file:// without a server.
// Bubbles sit in a band above the art, Sara's on the left and Marco's on the right.
// In a reaction panel Sara's bubble is the option label, so only Marco's reply is listed.

window.PACK_TALES = {
	ui: {
		en: {
			minutes: 'min',
			outcome: 'Outcome',
			trust: 'Trust',
			clarity: 'Clarity',
			debrief: 'Debrief',
			skill: 'Skill trained',
			yourPath: 'Your path',
			othersChose: 'of your company chose this',
			demoData: 'demo data',
			replay: 'Replay and explore other paths',
			reflection: 'Reflection',
			reflectionPlaceholder: 'Write a few lines, only you and the people you share with will see them.',
			share: 'Add to my next session with Elena',
			shared: 'Added to your next session',
			sessionWhen: 'Thu, 24 Oct · 15:00 · Mentoring with Elena',
			agendaItem: 'Agenda item',
			privacy: 'Your choices are visible only to you and Elena. HR sees aggregate engagement only.',
			step: 'Step',
			start: 'Start',
			youAre: 'You',
		},
		it: {
			minutes: 'min',
			outcome: 'Esito',
			trust: 'Fiducia',
			clarity: 'Chiarezza',
			debrief: 'Debrief',
			skill: 'Skill allenata',
			yourPath: 'Il tuo percorso',
			othersChose: 'della tua azienda ha scelto così',
			demoData: 'dati demo',
			replay: 'Rigioca ed esplora le altre strade',
			reflection: 'Riflessione',
			reflectionPlaceholder: 'Scrivi qualche riga, la vedranno solo tu e chi scegli.',
			share: 'Aggiungi alla prossima sessione con Elena',
			shared: 'Aggiunta alla prossima sessione',
			sessionWhen: 'Gio 24 ott · 15:00 · Mentoring con Elena',
			agendaItem: 'Punto in agenda',
			privacy: "Le tue scelte le vedete solo tu ed Elena. L'HR vede solo dati aggregati.",
			step: 'Passo',
			start: 'Inizia',
			youAre: 'Tu',
		},
	},

	story: {
		id: 'feedback',
		minutes: 4,
		cover: 'cover-feedback',
		title: { en: 'The feedback you keep postponing', it: 'Il feedback che rimandi da settimane' },
		blurb: {
			en: 'You are Sara. Marco is great. Marco is also late. Again.',
			it: 'Sei Sara. Marco è bravo. Marco è anche in ritardo. Di nuovo.',
		},
		skill: { en: 'Feedback (SBI model)', it: 'Feedback (modello SBI)' },
		model: {
			en: 'Situation → Behaviour → Impact, then ask. Describe facts, not the person, and leave room for their side before proposing anything.',
			it: 'Situazione → Comportamento → Impatto, poi chiedi. Descrivi i fatti, non la persona, e lascia spazio alla sua versione prima di proporre.',
		},
		takeaways: {
			en: [
				'Start from a fact both of you can see.',
				'The cause is often not where you think: ask before fixing.',
				'Close with a commitment on both sides and a date to check it.',
			],
			it: [
				'Parti da un fatto che entrambi potete vedere.',
				'La causa spesso non è dove pensi: chiedi prima di risolvere.',
				'Chiudi con un impegno da entrambe le parti e una data per verificarlo.',
			],
		},
		reflection: {
			en: 'When did you last postpone a feedback conversation? What were you afraid would happen?',
			it: "L'ultima volta che hai rimandato un feedback: cosa temevi che succedesse?",
		},

		beats: [
			{
				type: 'panel',
				image: 'p-hook',
				caption: {
					en: 'Monday, 9:10. The client report was due on Friday. It arrived this morning. Third time this quarter.',
					it: 'Lunedì, 9:10. Il report per il cliente era per venerdì. È arrivato stamattina. Terza volta nel trimestre.',
				},
				bubbles: [
					{
						who: 'sara',
						kind: 'thought',
						text: { en: "I can't keep putting this off.", it: 'Non posso continuare a rimandare.' },
					},
				],
			},
			{
				type: 'choice',
				id: 'opening',
				prompt: {
					en: 'You ask Marco for ten minutes. How do you open?',
					it: 'Chiedi a Marco dieci minuti. Come inizi?',
				},
				options: [
					{
						id: 'blame',
						trust: -1,
						clarity: 1,
						share: 38,
						label: {
							en: '"Marco, Friday again. This can\'t keep happening."',
							it: '"Marco, di nuovo venerdì. Non può continuare così."',
						},
						panel: {
							image: 'p-open-blame',
							caption: { en: 'Marco crosses his arms.', it: 'Marco incrocia le braccia.' },
							bubbles: [
								{
									who: 'marco',
									text: { en: 'Wow. OK. Good morning to you too.', it: 'Ah. Ok. Buongiorno anche a te.' },
								},
							],
						},
						note: {
							en: 'Direct, but it judges the person instead of describing the fact. People defend themselves before they listen.',
							it: 'Diretto, ma giudica la persona invece di descrivere il fatto. Le persone si difendono prima di ascoltare.',
						},
					},
					{
						id: 'vague',
						trust: 1,
						clarity: -1,
						share: 27,
						label: {
							en: '"So… how\'s everything going lately?"',
							it: '"Allora… come va ultimamente?"',
						},
						panel: {
							image: 'p-open-vague',
							caption: {
								en: 'Ten minutes of small talk. You still have to get to the point.',
								it: 'Dieci minuti di chiacchiere. Al punto devi ancora arrivarci.',
							},
							bubbles: [
								{
									who: 'marco',
									text: { en: 'All good! Busy, but good.', it: 'Tutto bene! Pieno, ma bene.' },
								},
							],
						},
						note: {
							en: 'Warm, but the real topic gets lost. Marco could easily leave thinking there is no problem.',
							it: 'Caldo, ma il tema vero si perde. Marco potrebbe uscire pensando che non ci sia nessun problema.',
						},
					},
					{
						id: 'sbi',
						trust: 1,
						clarity: 1,
						share: 35,
						label: {
							en: '"The Ferri report landed Monday instead of Friday, and the client noticed. I\'d like to understand what happened."',
							it: '"Il report Ferri è arrivato lunedì invece che venerdì, e il cliente se n\'è accorto. Vorrei capire cosa è successo."',
						},
						panel: {
							image: 'p-open-sbi',
							caption: { en: 'Marco takes a second.', it: 'Marco si prende un secondo.' },
							bubbles: [
								{
									who: 'marco',
									text: {
										en: "Yeah… I know. There's something I haven't told you.",
										it: "Sì… lo so. C'è una cosa che non ti ho detto.",
									},
								},
							],
						},
						note: {
							en: 'Situation, Behaviour, Impact: facts, not judgments. It leaves room for Marco\'s side of the story.',
							it: 'Situazione, Comportamento, Impatto: fatti, non giudizi. Lascia spazio alla versione di Marco.',
						},
					},
				],
			},
			{
				type: 'panel',
				image: 'p-explain',
				caption: { en: 'Marco takes a breath.', it: 'Marco prende fiato.' },
				bubbles: [
					{
						who: 'marco',
						text: {
							en: "I've been onboarding the two new hires. Nobody asked me to, but nobody else was doing it.",
							it: 'Sto seguendo io l\'onboarding dei due nuovi. Nessuno me l\'ha chiesto, ma nessun altro lo faceva.',
						},
					},
				],
			},
			{
				type: 'choice',
				id: 'response',
				prompt: { en: 'Now you know why. What do you say?', it: 'Ora sai perché. Cosa rispondi?' },
				options: [
					{
						id: 'dismiss',
						trust: -1,
						clarity: 1,
						share: 21,
						label: {
							en: '"That\'s not your job. Focus on your deliverables."',
							it: '"Non è compito tuo. Concentrati sulle tue consegne."',
						},
						panel: {
							image: 'p-resp-dismiss',
							caption: {
								en: "He stops talking. He won't bring it up again.",
								it: 'Smette di parlare. Non tirerà più fuori il tema.',
							},
							bubbles: [{ who: 'marco', text: { en: 'Right. Got it.', it: 'Certo. Ricevuto.' } }],
						},
						note: {
							en: 'Clear on priorities, but it dismisses a real contribution and ignores the actual cause: nobody owns onboarding.',
							it: "Chiaro sulle priorità, ma sminuisce un contributo reale e ignora la causa vera: l'onboarding non è di nessuno.",
						},
					},
					{
						id: 'curious',
						trust: 1,
						clarity: 1,
						share: 52,
						label: {
							en: '"Thanks for telling me, I hadn\'t seen it. What would help you?"',
							it: '"Grazie di avermelo detto, non me n\'ero accorta. Cosa ti aiuterebbe?"',
						},
						panel: {
							image: 'p-resp-curious',
							caption: { en: 'His shoulders drop an inch.', it: 'Le spalle si rilassano.' },
							bubbles: [
								{
									who: 'marco',
									text: {
										en: 'Honestly? Someone taking half of it. And one quiet afternoon for client work.',
										it: 'Sinceramente? Qualcuno che ne prenda metà. E un pomeriggio tranquillo per i clienti.',
									},
								},
							],
						},
						note: {
							en: 'Acknowledge first, then ask. The solution comes from Marco, so he owns it.',
							it: 'Prima riconosci, poi chiedi. La soluzione arriva da Marco, quindi è sua.',
						},
					},
					{
						id: 'avoid',
						trust: 0,
						clarity: -1,
						share: 27,
						label: {
							en: '"OK, no worries. Let\'s just push your deadlines back."',
							it: '"Ok, tranquillo. Spostiamo un po\' le tue scadenze."',
						},
						panel: {
							image: 'p-resp-avoid',
							caption: { en: 'Problem solved? Not really.', it: 'Problema risolto? Non proprio.' },
							bubbles: [
								{ who: 'marco', text: { en: '…Sure. If you say so.', it: '…Va bene. Se lo dici tu.' } },
							],
						},
						note: {
							en: 'It eases the moment, but the client still waits and onboarding stays on Marco\'s shoulders.',
							it: "Alleggerisce il momento, ma il cliente aspetta ancora e l'onboarding resta sulle spalle di Marco.",
						},
					},
				],
			},
			{
				type: 'choice',
				id: 'closing',
				prompt: { en: 'The meeting is almost over. How do you close?', it: 'La riunione sta finendo. Come chiudi?' },
				options: [
					{
						id: 'commit',
						trust: 1,
						clarity: 1,
						share: 44,
						label: {
							en: '"Let\'s agree: HR\'s buddy programme takes onboarding, you block Thursday afternoons. Check-in next Monday?"',
							it: '"Facciamo così: l\'onboarding passa al buddy programme dell\'HR, tu blocchi i giovedì pomeriggio. Ci risentiamo lunedì?"',
						},
						panel: {
							image: 'p-close',
							bubbles: [{ who: 'marco', text: { en: 'Deal. Monday at ten.', it: 'Affare fatto. Lunedì alle dieci.' } }],
						},
						note: {
							en: 'A concrete commitment on both sides and a date to check it. Feedback without follow-up fades.',
							it: 'Un impegno concreto da entrambe le parti e una data per verificarlo. Un feedback senza follow-up svanisce.',
						},
					},
					{
						id: 'wait',
						trust: 0,
						clarity: -1,
						share: 31,
						label: { en: '"Let\'s see how it goes."', it: '"Vediamo come va."' },
						panel: {
							image: 'p-close',
							bubbles: [{ who: 'marco', text: { en: 'Sure.', it: 'Certo.' } }],
						},
						note: {
							en: "Nothing is agreed, so nothing changes. In two weeks you'll be having the same conversation.",
							it: 'Niente di concordato, quindi niente cambia. Tra due settimane rifarai la stessa conversazione.',
						},
					},
					{
						id: 'watch',
						trust: -1,
						clarity: 0,
						share: 25,
						label: {
							en: '"From now on I\'ll keep an eye on your deadlines."',
							it: '"Da adesso terrò d\'occhio io le tue scadenze."',
						},
						panel: {
							image: 'p-close',
							bubbles: [{ who: 'marco', text: { en: '…Okay.', it: '…Ok.' } }],
						},
						note: {
							en: 'It sounds like control, not support. Marco feels watched, and trust drops.',
							it: 'Suona come controllo, non come supporto. Marco si sente sorvegliato e la fiducia scende.',
						},
					},
				],
			},
			{ type: 'ending' },
		],

		// Picked by trust + clarity across the three choices (range -3..6).
		endings: [
			{
				id: 'good',
				minScore: 4,
				image: 'end-good',
				title: { en: 'Trust up, problem solved', it: 'Più fiducia, problema risolto' },
				caption: {
					en: "Two weeks later. The report lands on Wednesday. Marco runs the new hires' kickoff, with HR's buddy programme behind him.",
					it: 'Due settimane dopo. Il report arriva mercoledì. Marco guida il kickoff dei nuovi, con il buddy programme dell\'HR alle spalle.',
				},
			},
			{
				id: 'mixed',
				minScore: 1,
				image: 'end-mixed',
				title: { en: 'On time, at a cost', it: 'In orario, a caro prezzo' },
				caption: {
					en: 'Two weeks later. Deadlines are back on track, but Marco works late and speaks less in meetings. The cause is still there.',
					it: 'Due settimane dopo. Le scadenze sono rispettate, ma Marco lavora fino a tardi e in riunione parla meno. La causa è ancora lì.',
				},
			},
			{
				id: 'poor',
				minScore: -Infinity,
				image: 'end-poor',
				title: { en: "The conversation that didn't happen", it: 'La conversazione che non c\'è stata' },
				caption: {
					en: 'Two weeks later. Another late delivery. Marco has stopped explaining, and he spends a lot of time on his phone.',
					it: 'Due settimane dopo. Un altro ritardo. Marco ha smesso di dare spiegazioni e passa molto tempo al telefono.',
				},
			},
		],
	},
};
