const { ui, story } = window.PACK_TALES;

const SPEAKERS = {
	sara: { side: 'left', name: { en: 'Sara (you)', it: 'Sara (tu)' } },
	marco: { side: 'right', name: { en: 'Marco', it: 'Marco' } },
};
const LANG_KEY = 'packtales.lang';
const choiceBeats = story.beats.filter((beat) => beat.type === 'choice');

const state = {
	lang: readLang(),
	hasStarted: false,
	choices: {},
	reflection: '',
	isShared: false,
	revealedCount: 0,
};

const app = document.getElementById('app');

function readLang() {
	try {
		return localStorage.getItem(LANG_KEY) ?? 'en';
	} catch {
		return 'en';
	}
}

function saveLang(lang) {
	try {
		localStorage.setItem(LANG_KEY, lang);
	} catch {
		// Private mode or blocked storage: the toggle still works for this visit.
	}
}

function t(key) {
	return ui[state.lang][key];
}

function text(localized) {
	return localized[state.lang];
}

function h(tag, attributes = {}, ...children) {
	const element = document.createElement(tag);
	for (const [name, value] of Object.entries(attributes)) {
		if (name.startsWith('on')) element.addEventListener(name.slice(2), value);
		else if (value !== false && value !== undefined) element.setAttribute(name, value);
	}
	element.append(...children.flat().filter((child) => child !== null && child !== undefined));
	return element;
}

function image(id, alt) {
	return h('img', { src: `images/${id}.jpg`, alt, loading: 'lazy' });
}

function selectedOption(choiceBeat) {
	return choiceBeat.options.find((option) => option.id === state.choices[choiceBeat.id]);
}

function score() {
	return choiceBeats.reduce(
		(totals, beat) => {
			const option = selectedOption(beat);
			return { trust: totals.trust + option.trust, clarity: totals.clarity + option.clarity };
		},
		{ trust: 0, clarity: 0 },
	);
}

function ending() {
	const { trust, clarity } = score();
	return story.endings.find((candidate) => trust + clarity >= candidate.minScore);
}

// Beats are shown up to (and including) the first unanswered choice; panels in between appear on their own.
function visibleBeats() {
	const firstOpen = story.beats.findIndex((beat) => beat.type === 'choice' && !state.choices[beat.id]);
	return firstOpen === -1 ? story.beats : story.beats.slice(0, firstOpen + 1);
}

function bubble({ who, kind, text: content }) {
	const speaker = SPEAKERS[who];
	return h(
		'div',
		{ class: `bubble bubble--${speaker.side} ${kind === 'thought' ? 'bubble--thought' : ''}` },
		h('span', { class: 'bubble__name' }, text(speaker.name)),
		h('p', {}, text(content)),
	);
}

function panel({ image: imageId, caption, bubbles = [] }) {
	return h(
		'figure',
		{ class: 'panel' },
		bubbles.length ? h('div', { class: 'panel__band' }, bubbles.map(bubble)) : null,
		image(imageId, caption ? text(caption) : ''),
		caption ? h('figcaption', { class: 'panel__caption' }, text(caption)) : null,
	);
}

function reactionPanel(option) {
	return panel({
		...option.panel,
		bubbles: [{ who: 'sara', text: option.label }, ...option.panel.bubbles],
	});
}

function choiceCard(beat) {
	return h(
		'section',
		{ class: 'choice', 'aria-label': text(beat.prompt) },
		h('p', { class: 'choice__prompt' }, text(beat.prompt)),
		beat.options.map((option, index) =>
			h(
				'button',
				{ class: 'choice__option', type: 'button', onclick: () => handleChoose(beat.id, option.id) },
				h('span', { class: 'choice__letter' }, String.fromCharCode(65 + index)),
				h('span', {}, text(option.label)),
			),
		),
	);
}

function meter(label, value) {
	// value is in -3..3 across three choices
	const percent = Math.round(((value + 3) / 6) * 100);
	return h(
		'div',
		{ class: 'meter' },
		h('span', { class: 'meter__label' }, label),
		h('span', { class: 'meter__track' }, h('span', { class: 'meter__fill', style: `width:${percent}%` })),
	);
}

function endingSection() {
	const result = ending();
	const { trust, clarity } = score();
	return h(
		'section',
		{ class: 'ending' },
		h('p', { class: 'eyebrow' }, t('outcome')),
		h('h2', {}, text(result.title)),
		panel({ image: result.image, caption: result.caption }),
		h('div', { class: 'meters' }, meter(t('trust'), trust), meter(t('clarity'), clarity)),
		debriefCard(),
		reflectionCard(),
	);
}

function debriefCard() {
	return h(
		'section',
		{ class: 'card' },
		h('p', { class: 'eyebrow' }, t('debrief')),
		h('p', { class: 'skill' }, h('strong', {}, `${t('skill')}: `), text(story.skill)),
		h('p', { class: 'model' }, text(story.model)),
		h('ul', { class: 'takeaways' }, text(story.takeaways).map((item) => h('li', {}, item))),
		h('p', { class: 'eyebrow' }, t('yourPath')),
		h(
			'ol',
			{ class: 'path' },
			choiceBeats.map((beat) => {
				const option = selectedOption(beat);
				return h(
					'li',
					{},
					h('p', { class: 'path__prompt' }, text(beat.prompt)),
					h('p', { class: 'path__label' }, text(option.label)),
					h('p', { class: 'path__note' }, text(option.note)),
					h('p', { class: 'path__share' }, `${option.share}% ${t('othersChose')} · ${t('demoData')}`),
				);
			}),
		),
		h('button', { class: 'button button--ghost', type: 'button', onclick: handleReplay }, t('replay')),
	);
}

function reflectionCard() {
	const textarea = h('textarea', {
		rows: 3,
		placeholder: t('reflectionPlaceholder'),
		oninput: (event) => (state.reflection = event.target.value),
	});
	textarea.value = state.reflection;

	return h(
		'section',
		{ class: 'card card--reflection' },
		h('p', { class: 'eyebrow' }, t('reflection')),
		h('p', { class: 'reflection__question' }, text(story.reflection)),
		state.isShared ? h('p', { class: 'reflection__answer' }, state.reflection || '—') : textarea,
		state.isShared
			? sessionConfirmation()
			: h('button', { class: 'button', type: 'button', onclick: handleShare }, t('share')),
	);
}

function sessionConfirmation() {
	const path = choiceBeats.map((beat) => String.fromCharCode(65 + beat.options.indexOf(selectedOption(beat)))).join(' → ');
	return h(
		'div',
		{ class: 'session', role: 'status' },
		h(
			'div',
			{ class: 'session__head' },
			image('mentor', 'Elena'),
			h('div', {}, h('strong', {}, t('shared')), h('span', {}, t('sessionWhen'))),
		),
		h(
			'div',
			{ class: 'session__agenda' },
			h('span', { class: 'eyebrow' }, t('agendaItem')),
			h('p', {}, `${text(story.title)} · ${path} · ${text(ending().title)}`),
		),
		h('p', { class: 'session__privacy' }, t('privacy')),
	);
}

function intro() {
	return h(
		'section',
		{ class: 'intro' },
		image(story.cover, text(story.title)),
		h('div', { class: 'intro__body' }, [
			h('p', { class: 'eyebrow' }, `${text(story.skill)} · ${story.minutes} ${t('minutes')}`),
			h('h1', {}, text(story.title)),
			h('p', {}, text(story.blurb)),
			h('button', { class: 'button', type: 'button', onclick: handleStart }, t('start')),
		]),
	);
}

function topBar() {
	const answered = Object.keys(state.choices).length;
	return h(
		'header',
		{ class: 'topbar' },
		h('img', { class: 'topbar__logo', src: 'images/pack-wordmark.svg', alt: 'Pack' }),
		h('span', { class: 'topbar__title' }, 'Tales'),
		h(
			'div',
			{ class: 'lang', role: 'group', 'aria-label': 'Language' },
			['en', 'it'].map((lang) =>
				h(
					'button',
					{ type: 'button', 'aria-pressed': String(state.lang === lang), onclick: () => handleLang(lang) },
					lang.toUpperCase(),
				),
			),
		),
		state.hasStarted
			? h(
					'div',
					{ class: 'progress', 'aria-label': `${t('step')} ${answered}/${choiceBeats.length}` },
					h('span', { style: `width:${(answered / choiceBeats.length) * 100}%` }),
				)
			: null,
	);
}

function beatElement(beat) {
	if (beat.type === 'panel') return panel(beat);
	if (beat.type === 'ending') return endingSection();
	const option = selectedOption(beat);
	return option ? reactionPanel(option) : choiceCard(beat);
}

function strip() {
	const beats = visibleBeats();
	// The whole strip is rebuilt on each render: only the beats just revealed (and the swapped choice) animate in.
	const firstNew = Math.max(state.revealedCount - 1, 0);
	state.revealedCount = beats.length;
	return h(
		'main',
		{ class: 'strip' },
		beats.map((beat, index) => {
			const element = beatElement(beat);
			if (index >= firstNew) element.classList.add('is-new');
			return element;
		}),
	);
}

function render() {
	app.replaceChildren(topBar(), state.hasStarted ? strip() : intro());
	document.documentElement.lang = state.lang;
}

function handleStart() {
	state.hasStarted = true;
	render();
	window.scrollTo({ top: 0 });
}

function handleChoose(choiceId, optionId) {
	const revealedBefore = app.querySelectorAll('.strip > *').length;
	state.choices[choiceId] = optionId;
	render();
	// The choice card is replaced by the reaction panel: land there, not at the bottom of the page.
	app.querySelectorAll('.strip > *')[revealedBefore - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleReplay() {
	state.choices = {};
	state.isShared = false;
	state.revealedCount = 0;
	render();
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleShare() {
	state.isShared = true;
	state.revealedCount += 1;
	render();
	app.querySelector('.session')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function handleLang(lang) {
	state.lang = lang;
	saveLang(lang);
	state.revealedCount += 1;
	const scrollY = window.scrollY;
	render();
	window.scrollTo({ top: scrollY });
}

render();
