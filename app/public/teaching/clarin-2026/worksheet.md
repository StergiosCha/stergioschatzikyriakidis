---
title: "AI Applications for Language Analysis"
subtitle: "CLARIN:EL participant worksheet, 24 September 2026"
author: "Stergios Chatzikyriakidis, ILSP"
date: "10:15 to 11:00"
---

## Start here

Open the [interactive workshop](https://stergioschatzikyriakidis.org/teaching/clarin-2026/demo.html) for complete texts, prompts, graphs and saved analyses. Use **Copy input & open app** to take the selected input into the corresponding tool. The [Svarna demos page](https://stergioscha.github.io/svarna/demos.html) also links to the live apps.

Use your own provider key, or a temporary key supplied for the session. Enter it only in the app's provider settings. Choose the matching provider. The recorded Google Rhyme example uses **Gemini 3.5 Flash-Lite**. If an app is unavailable, the HTML retains the texts and recorded results.

Direct links: [Rhyme](https://greek-app-heaven-rhyme.livelyhill-85880e66.westeurope.azurecontainerapps.io), [MEDEA](https://greek-app-heaven-medea.livelyhill-85880e66.westeurope.azurecontainerapps.io), [Zeugma](https://greek-app-heaven-medea.livelyhill-85880e66.westeurope.azurecontainerapps.io/zeugma).

## A. The analyst who cannot hear (15 minutes)

George Seferis, *Denial*, second stanza. Existing app example:

Πάνω στην άμμο την ξανθή  
γράψαμε τ' όνομά της·  
ωραία που φύσηξεν ο μπάτης  
και σβήστηκε η γραφή.

1. In Rhyme identification, paste the stanza. Select **Few-Shot**, one model, **RAG off** and **verification off**. Click **Ανάλυση (Analyze)**. Save the answer.
2. Open the complete Few-Shot prompt in the HTML's **Texts & prompts** tab. Both target pairs are already among the examples. Is this an independent test of an unseen rhyme?
3. Select **Zero-Shot Structured**, retaining the same model and poem, with RAG and verification off. Analyze and compare the actual response. A correct answer is also a result.
4. Enable verification. Analyze again and read **INITIAL LLM ANALYSIS**, **PHONOLOGICAL VERIFICATION** and **LLM REFLECTION & CORRECTION**. This run starts with a new initial answer; compare its own initial and final responses.

Reference: **ξανθή / γραφή** is M (final stress); **όνομά της / μπάτης** is F2 (penultimate stress), with a mosaic rhyme crossing a word boundary. F3 means antepenultimate stress. Rich, mosaic, imperfect and copy describe separate features.

Which sound sequence carries the rhyme? Did the model preserve stress across the word boundary? Did verification supply useful evidence? A fluent explanation is not itself a phonological check.

### Additional input: Solomos, Hymn to Liberty

Σε γνωρίζω από την κόψη  
του σπαθιού την τρομερή,  
σε γνωρίζω από την όψη  
που με βία μετράει τη γη.

Απ' τα κόκαλα βγαλμένη  
των Ελλήνων τα ιερά,  
και σαν πρώτα ανδρειωμένη,  
χαίρε, ω χαίρε, ελευθεριά!

Dionysios Solomos, 1823, public domain. Reference classes:

- κόψη / όψη: F2
- τρομερή / γη: M
- βγαλμένη / ανδρειωμένη: F2
- ιερά / ελευθεριά: M

For an independent chat comparison, paste either stanza after this instruction:

> Identify the rhyming line pairs. Classify stress as M (final), F2 (penultimate) or F3 (antepenultimate). Assess rich, mosaic, imperfect and copy separately. Quote the rhyme domain, locate its stress and explain your reasoning.

## B. What does Achilles feel? (13 minutes)

Use the complete English **Iliad 1.172 to 1.224** passage in the HTML's **Emotions & NeSy** module. The Greek reference appears alongside it. The passage includes Achilles' grief, wonder and continuing wrath.

1. Open [MEDEA Emotions](https://greek-app-heaven-medea.livelyhill-85880e66.westeurope.azurecontainerapps.io/emotions). Paste the complete English input. Select English and a configured provider. Compare **Script-Based Analysis** off and on, preserving the output from each run.
2. Inspect what the Cairns prompt adds: eliciting conditions, appraisals, action tendencies and embodied metaphors. Check every claimed quotation against the passage. A prompt example is not evidence from Homer.
3. Open [NeSy Emotions](https://greek-app-heaven-medea.livelyhill-85880e66.westeurope.azurecontainerapps.io/emotions-nesy). Use the same input, **Genre Context: Epic**, **Language: English**, the same provider and **Enable Feedback Loop** on. Select a mode and click **Analyze (Neuro-Symbolic)**; use **Download JSON** to save it.
4. Compare NeSy1 to NeSy4 using the complete saved records in the HTML. Trace explicit grief through the rule objections and feedback. In NeSy4, separate the baseline, free reading, dialogue, critic and proposed ontology amendments.

Does putting away a sword establish that anger ended? Does a clean consistency check establish that all emotions were captured? When should the interpretation change, and when should the theory change?

## C. Propose, then query: Zeugma (10 minutes)

Use the shorter **Thucydides 2.2** selection in the HTML, which begins “a Theban force”. The complete passage, original Greek and all six queries are also there. The English is Richard Crawley's translation via Perseus; source and licence credits accompany the text.

1. Paste the selection into **Step 1: Ancient Text for Graph Extraction**. Keep **Reasoning Mode: Basic**, select the provider, then click **Step 1: Extract Knowledge Graph**.
2. Inspect the named entities, relation claims and **Available Predicates**. The backend shares a graph: use the same extraction for the group's query exercise, since another extraction can replace it.
3. In **Step 2: Zeugma Symbolic Queries**, enter one query per line and click **Run Queries**. Check **Detailed Output Log** and the returned bindings. Predicate names and IDs must belong to the current graph.
4. In the HTML's saved graph, follow the six queries to commanders, gate-opening, alliances and collaboration. Compare the full-passage graph's membership claim with the source's invitation to join.

A valid inference from stored facts does not establish that those facts faithfully represent the source. The interface's consistency score does not check every historical claim against Thucydides.

## D. What counts as nature? (7 minutes)

Open [Nature Analysis](https://greek-app-heaven-nature.livelyhill-85880e66.westeurope.azurecontainerapps.io/dashboard). Copy the complete 342-word Greek workshop fiction from the HTML. Select a configured provider/model, **Whole Text**, minimum words **5** and threshold **0.2**, then choose **Analyze Nature Content**. The saved comparison uses Claude Sonnet 5; a separate Google Flash-Lite request also completed on this text.

Compare the extracted nature elements, metaphors and explanation with the passage. Are you counting literal objects, figurative expressions, memories or absences? The saved Claude result places harvesting nets under flora. What annotation would better capture that passage? The app supplies model judgements without an independent symbolic check of the reading.

## Further activities

The HTML also contains complete material for PlotAnalyzer, Voyant-NLP, Svarna, TermGuard, Linguistic Distance, Dialect Generator and NATS. PlotAnalyzer NeSy requires an **OpenRouter** key. Svarna is a separate corpus workbench.

For Linguistic Distance, select **Ancient Greek → Modern Greek** and the dimensions, then **Run Analysis** and **Create Visualization**. Initialization is automatic. For dialect generation, select the recorded model, dialect, prompt and token limit; read the saved output while a fresh CPU request runs. Compare a distinctive form with its contexts in Svarna before assigning a dialect label.

These examples connect to the 11:30 low-resource-varieties session with Markantonatou, Bompolas, Stamou and Dimakis.
