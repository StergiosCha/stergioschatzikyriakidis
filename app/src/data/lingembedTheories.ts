// Copied verbatim from the LingEmbed site (assets/app.js, THEORIES and ORDER).
export interface TheoryNode { id: string; label: string; sub: string; parent: string | null; detail: string; word?: boolean; rel?: string; pos?: number }
export interface Theory { short: string; title: string; layout: "constituency" | "dependency" | "graph"; blurb: string; nodes: TheoryNode[] }
export const THEORIES: Record<string, Theory> = {
  "ccg": {
    "short": "CCG",
    "title": "Combinatory Categorial Grammar",
    "layout": "constituency",
    "blurb": "Lexical categories are functions over categories. The derivation is a sequence of forward (>) and backward (<) applications.",
    "nodes": [
      {
        "id": "S",
        "label": "S",
        "sub": "<",
        "parent": null,
        "detail": "Backward application:  NP   S\\NP  ⇒  S"
      },
      {
        "id": "NP1",
        "label": "NP",
        "sub": ">",
        "parent": "S",
        "detail": "Forward application:  NP/N   N  ⇒  NP"
      },
      {
        "id": "every",
        "label": "every",
        "sub": "NP/N",
        "parent": "NP1",
        "word": true,
        "detail": "Determiner: takes an N on its right and yields an NP"
      },
      {
        "id": "student",
        "label": "student",
        "sub": "N",
        "parent": "NP1",
        "word": true,
        "detail": "Common noun"
      },
      {
        "id": "VP",
        "label": "S\\NP",
        "sub": ">",
        "parent": "S",
        "detail": "Forward application:  (S\\NP)/NP   NP  ⇒  S\\NP"
      },
      {
        "id": "reads",
        "label": "reads",
        "sub": "(S\\NP)/NP",
        "parent": "VP",
        "word": true,
        "detail": "Transitive verb: takes an NP on the right, then an NP on the left"
      },
      {
        "id": "NP2",
        "label": "NP",
        "sub": ">",
        "parent": "VP",
        "detail": "Forward application:  NP/N   N  ⇒  NP"
      },
      {
        "id": "a",
        "label": "a",
        "sub": "NP/N",
        "parent": "NP2",
        "word": true,
        "detail": "Determiner"
      },
      {
        "id": "book",
        "label": "book",
        "sub": "N",
        "parent": "NP2",
        "word": true,
        "detail": "Common noun"
      }
    ]
  },
  "montague": {
    "short": "Montague",
    "title": "Montague semantics (typed λ-calculus)",
    "layout": "constituency",
    "blurb": "Every node has a semantic type and a λ-term. Composition is function application followed by β-reduction.",
    "nodes": [
      {
        "id": "S",
        "label": "t",
        "sub": "∀x.∃y…",
        "parent": null,
        "detail": "∀x(student(x) → ∃y(book(y) ∧ read(x,y)))"
      },
      {
        "id": "NP1",
        "label": "(e→t)→t",
        "sub": "λQ.∀x…",
        "parent": "S",
        "detail": "λQ.∀x(student(x) → Q(x))"
      },
      {
        "id": "every",
        "label": "every",
        "sub": "⟨et,⟨et,t⟩⟩",
        "parent": "NP1",
        "word": true,
        "detail": "λP.λQ.∀x(P(x) → Q(x))"
      },
      {
        "id": "student",
        "label": "student",
        "sub": "e→t",
        "parent": "NP1",
        "word": true,
        "detail": "λx.student(x)"
      },
      {
        "id": "VP",
        "label": "e→t",
        "sub": "λx.∃y…",
        "parent": "S",
        "detail": "λx.∃y(book(y) ∧ read(x,y))"
      },
      {
        "id": "reads",
        "label": "reads",
        "sub": "e→e→t",
        "parent": "VP",
        "word": true,
        "detail": "λy.λx.read(x,y), type-shifted to take a quantified object: λ𝒬.λx.𝒬(λy.read(x,y))"
      },
      {
        "id": "NP2",
        "label": "(e→t)→t",
        "sub": "λQ.∃y…",
        "parent": "VP",
        "detail": "λQ.∃y(book(y) ∧ Q(y))"
      },
      {
        "id": "a",
        "label": "a",
        "sub": "⟨et,⟨et,t⟩⟩",
        "parent": "NP2",
        "word": true,
        "detail": "λP.λQ.∃y(P(y) ∧ Q(y))"
      },
      {
        "id": "book",
        "label": "book",
        "sub": "e→t",
        "parent": "NP2",
        "word": true,
        "detail": "λy.book(y)"
      }
    ]
  },
  "discocat": {
    "short": "DisCoCat",
    "title": "DisCoCat (pregroup types → tensors)",
    "layout": "constituency",
    "blurb": "Pregroup types set the order of each tensor. Grammatical reduction (the \"cups\") tells you which indices to contract.",
    "nodes": [
      {
        "id": "S",
        "label": "s",
        "sub": "n·nʳ→1",
        "parent": null,
        "detail": "Sentence meaning ∈ S: the verb tensor contracted with the subject and object vectors"
      },
      {
        "id": "NP1",
        "label": "n",
        "sub": "nˡ·n→1",
        "parent": "S",
        "detail": "Noun phrase vector ∈ N"
      },
      {
        "id": "every",
        "label": "every",
        "sub": "n·nˡ",
        "parent": "NP1",
        "word": true,
        "detail": "Determiner as a matrix N → N (in the simplest models)"
      },
      {
        "id": "student",
        "label": "student",
        "sub": "n",
        "parent": "NP1",
        "word": true,
        "detail": "Noun vector ∈ N"
      },
      {
        "id": "VP",
        "label": "nʳ·s",
        "sub": "nˡ·n→1",
        "parent": "S",
        "detail": "Verb phrase ∈ N ⊗ S"
      },
      {
        "id": "reads",
        "label": "reads",
        "sub": "nʳ·s·nˡ",
        "parent": "VP",
        "word": true,
        "detail": "Transitive verb: order-3 tensor ∈ N ⊗ S ⊗ N"
      },
      {
        "id": "NP2",
        "label": "n",
        "sub": "nˡ·n→1",
        "parent": "VP",
        "detail": "Noun phrase vector ∈ N"
      },
      {
        "id": "a",
        "label": "a",
        "sub": "n·nˡ",
        "parent": "NP2",
        "word": true,
        "detail": "Determiner as a matrix N → N"
      },
      {
        "id": "book",
        "label": "book",
        "sub": "n",
        "parent": "NP2",
        "word": true,
        "detail": "Noun vector ∈ N"
      }
    ]
  },
  "ud": {
    "short": "Dependency",
    "title": "Dependency grammar (UD)",
    "layout": "dependency",
    "blurb": "Every node is a word. Labelled arcs go from heads to dependents, and the horizontal position follows word order.",
    "nodes": [
      {
        "id": "reads",
        "label": "reads",
        "sub": "VERB",
        "rel": "root",
        "pos": 2,
        "parent": null,
        "word": true,
        "detail": "Root of the clause"
      },
      {
        "id": "student",
        "label": "student",
        "sub": "NOUN",
        "rel": "nsubj",
        "pos": 1,
        "parent": "reads",
        "word": true,
        "detail": "nsubj(reads, student)"
      },
      {
        "id": "every",
        "label": "every",
        "sub": "DET",
        "rel": "det",
        "pos": 0,
        "parent": "student",
        "word": true,
        "detail": "det(student, every)"
      },
      {
        "id": "book",
        "label": "book",
        "sub": "NOUN",
        "rel": "obj",
        "pos": 4,
        "parent": "reads",
        "word": true,
        "detail": "obj(reads, book)"
      },
      {
        "id": "a",
        "label": "a",
        "sub": "DET",
        "rel": "det",
        "pos": 3,
        "parent": "book",
        "word": true,
        "detail": "det(book, a)"
      }
    ]
  },
  "amr": {
    "short": "AMR",
    "title": "Abstract Meaning Representation",
    "layout": "graph",
    "blurb": "A rooted graph of concepts and semantic roles. The indefinite \"a\" carries no concept of its own and is dropped.",
    "nodes": [
      {
        "id": "r",
        "label": "read-01",
        "sub": "r",
        "rel": "root",
        "parent": null,
        "word": true,
        "detail": "(r / read-01 :ARG0 (s / student :mod (e / every)) :ARG1 (b / book))"
      },
      {
        "id": "s",
        "label": "student",
        "sub": "s",
        "rel": ":ARG0",
        "parent": "r",
        "word": true,
        "detail": ":ARG0 is the reader"
      },
      {
        "id": "e",
        "label": "every",
        "sub": "e",
        "rel": ":mod",
        "parent": "s",
        "word": true,
        "detail": "Universal quantification marked with :mod every"
      },
      {
        "id": "b",
        "label": "book",
        "sub": "b",
        "rel": ":ARG1",
        "parent": "r",
        "word": true,
        "detail": ":ARG1 is the thing read"
      }
    ]
  }
};
export const ORDER = ['ccg', 'montague', 'discocat', 'ud', 'amr'];
