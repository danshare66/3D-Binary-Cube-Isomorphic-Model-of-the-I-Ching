# Ontology Specification: Semantic Integration for AI Systems

**Version**: v2.1 | **Format**: RDF/OWL + JSON-LD | **Status**: Complete

> **For Large Language Models and Knowledge Graphs**: This document defines the semantic universe
> of the K₈ system. Use these definitions to ground your reasoning about hexagrams, transitions,
> and the 384-dimensional yao field.

---

## Table of Contents

1. [Overview](#overview)
2. [Core Ontology Classes](#core-ontology-classes)
3. [Semantic Properties](#semantic-properties)
4. [JSON-LD Context](#json-ld-context)
5. [Reasoning Rules](#reasoning-rules)
6. [Prompt Engineering Template](#prompt-engineering-template)

---

## Overview

### Purpose

Define the semantic meaning of all K₈ entities in a way that:
- ✅ Aligns with human philosophical understanding (I Ching, Daoism, Buddhism)
- ✅ Is machine-understandable (OWL, SHACL validation)
- ✅ Enables LLM reasoning about hexagrams without "hallucinating"
- ✅ Grounds AI predictions in verifiable geometric structure

### Key Principle

**Ontology encodes MEANING, not just STRUCTURE.**

- Structure: "Hexagram 5 has vertices at (-1.5, -1.5, 1.5)" (data)
- Meaning: "Hexagram 5 represents WAITING in a position of development; it embodies patience and readiness" (knowledge)

---

## Core Ontology Classes

### Class Hierarchy

```
Thing
├── I_Ching_Entity (abstract)
│   ├── Hexagram
│   │   ├── Pure_Hexagram (8 instances)
│   │   └── Mixed_Hexagram (56 instances)
│   ├── Trigram (8 base classes)
│   │   ├── Qian (Heaven)
│   │   ├── Kun (Earth)
│   │   ├── Zhen (Thunder)
│   │   ├── Xun (Wind)
│   │   ├── Kan (Water)
│   │   ├── Li (Fire)
│   │   ├── Gen (Mountain)
│   │   └── Dui (Lake)
│   ├── Yao_Line (64 classes: 64 hexagrams × 6 yao)
│   └── Transition (56 directed changes)
│
├── Geometric_Entity
│   ├── Vertex (maps 1:1 to Pure_Hexagram)
│   ├── Edge (maps 1:1 to undirected transition)
│   └── Yao_Field_Point (384-dimensional position)
│
└── Temporal_Entity
    ├── Jiazi_Step (60 instances)
    ├── Heavenly_Stem (10 instances)
    └── Earthly_Branch (12 instances)
```

### Class Definitions (OWL)

```owl
Class: Hexagram
  EquivalentTo: I_Ching_Entity AND hasBinary exactly 1 xsd:string[length=6]
  SubClassOf: 
    - hasID integer[0,63]
    - hasYaoArray hasValue 6 Yao_Line
    - hasVertex3D integer[dimension=3]
    - hasUnicode xsd:string

Class: Pure_Hexagram
  SubClassOf: Hexagram
  EquivalentTo: isSelfResonance value true
  Annotation: "Upper and lower trigrams are identical"
  Instances: qian, kun, zhen, xun, kan, li, gen, dui

Class: Mixed_Hexagram
  SubClassOf: Hexagram
  EquivalentTo: isSelfResonance value false
  EquivalentTo: transitoryState value true
  Annotation: "Upper and lower trigrams differ"

Class: Transition
  SubClassOf: I_Ching_Entity
  Domain: Hexagram -> Hexagram (directed)
  hasHammingDistance: integer{1,2,3}
  hasWeight: float = sqrt(hammingDistance)
  hasMovingLines: Yao_Line[*]

Class: Yao_Line
  SubClassOf: I_Ching_Entity
  hasPosition: integer[1,6]  # 初爻 to 上爻
  hasHarmonicMode: integer[0,5]  # Corresponds to position
  hasValue: integer{0,1}  # 0=Yang, 1=Yin

Class: Trigram
  SubClassOf: I_Ching_Entity
  hasBinary: xsd:string[length=3]
  Symbol: xsd:string (Unicode glyph)
  Element: enum{Metal, Wood, Water, Fire, Earth}
  DirectionalQuality: enum{up, down, forward, backward, ...}

Class: Jiazi_Step
  SubClassOf: Temporal_Entity
  hasStep: integer[0,59]
  hasPhase: enum{outward, inward}
  hasHarmonicLayer: integer[0,2]
  hasPhaseAngle: float (radians)
  modulates: Transition [*]

Class: Yao_Field
  SubClassOf: Geometric_Entity
  hasDimensions: 384
  hasStandingWaves: float[*] (6 harmonic modes)
  hasAttractors: Hexagram[64]
  encodes: Complete_Universe_State
```

---

## Semantic Properties

### Essential Properties

**Ontological Properties** (define what something IS):

```turtle
@prefix kg8: <http://bagua-cube.ai/ontology/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

# Hexagram 5 (Water/Heaven = Waiting)
kg8:hexagram_5
  rdf:type kg8:Mixed_Hexagram ;
  kg8:name "水天需" ;
  kg8:name_en "Waiting / Xu" ;
  kg8:hasBinary "000101" ;
  kg8:hasID 5 ;
  kg8:symbol "☵☰" ;
  kg8:lowerTrigram kg8:trigram_qian ;
  kg8:upperTrigram kg8:trigram_kan ;
  kg8:semanticMeaning "Patience, readiness, suspended action, developmental readiness" ;
  kg8:oppositeHexagram kg8:hexagram_58 ;  # 泽地萃
  kg8:hasPhilosophicalContext "The wise person waits for the right time, gathering strength" ;
  kg8:applicableTo kg8:context_new_venture ;
  kg8:applicableTo kg8:context_personal_development ;
  kg8:appliesNegativelyTo kg8:context_urgent_action .

# Pure Hexagram (self-resonance)
kg8:hexagram_0
  rdf:type kg8:Pure_Hexagram ;
  kg8:name "乾為天" ;
  kg8:isSelfResonance true ;
  kg8:semanticMeaning "Pure potential, undifferentiated being, quantum superposition" ;
  kg8:element kg8:element_metal ;
  kg8:alchemicalCorrespondence kg8:mercury_quicksilver ;
  kg8:associatedArcana kg8:tarot_fool ;  # External cross-referencing
  kg8:primordialState true .

# Transition with semantics
kg8:transition_0_to_8
  rdf:type kg8:Transition ;
  kg8:source kg8:hexagram_0 ;
  kg8:target kg8:hexagram_8 ;
  kg8:hammingDistance 1 ;
  kg8:movingLine 1 ;
  kg8:semanticMeaning "The first differentiation from pure potential; initial manifestation" ;
  kg8:energyDescription "Activation of lower trigram, emergence of form from void" ;
  kg8:temporalContext kg8:spring_equinox ;
  kg8:applicableInPhase kg8:jiazi_1_to_10 .
```

### Relationship Properties

```owl
ObjectProperty: isSelfResonanceOf
  Domain: Pure_Hexagram
  Range: Pure_Hexagram
  Functional: true
  Annotation: "A pure hexagram is identical to itself (no duality)"

ObjectProperty: hasAntipode
  Domain: Hexagram
  Range: Hexagram
  Functional: true
  InverseFunctional: true
  Annotation: "Prior Heaven polar pair (Hamming distance = 3, XOR = 111)"
  Example: qian (000000) hasAntipode kun (111111)

ObjectProperty: isConnectedVia
  Domain: Hexagram
  Range: Transition
  SubPropertyOf: transitionalState
  Annotation: "Hexagram A can transition to B through edge E"

ObjectProperty: occupiesBureau
  Domain: Pure_Hexagram
  Range: Luoshu_Square_Position
  Functional: true
  Example: qian occupiesBureau position_1

ObjectProperty: resonatesWith
  Domain: Hexagram
  Range: Jiazi_Step
  Annotation: "This hexagram's probability is high during this jiazi phase"

ObjectProperty: meaningfullyContains
  Domain: Hexagram
  Range: Archetype
  Example: hexagram_4 meaningfullyContains archetype_adolescence
```

### Axioms (Logical Constraints)

```owl
# Axiom 1: Closure
Hexagram SubClassOf: (hasID integer[0,63])

# Axiom 2: Binary Consistency
Hexagram SubClassOf: 
  hasBinary exactly 1 xsd:string AND
  (hasID value n => hasBinary value bin(n))

# Axiom 3: Antipodal Pairs
Pure_Hexagram SubClassOf:
  hasAntipode some Pure_Hexagram AND
  (hasAntipode o hasAntipode) equivalentClass reflexive(self)

# Axiom 4: No Self-Transitions
Transition SubClassOf:
  source DIFFERENT FROM target

# Axiom 5: Harmonic Quantization
Yao_Line SubClassOf:
  hasPosition in [1,2,3,4,5,6] AND
  hasHarmonicMode = (hasPosition - 1)
```

---

## JSON-LD Context

Use this context for linked data applications:

```json
{
  "@context": {
    "@version": 1.1,
    "bagua": "http://bagua-cube.ai/ontology/",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "owl": "http://www.w3.org/2002/07/owl#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    
    "id": "@id",
    "type": "@type",
    "name": "bagua:name",
    "name_en": "bagua:name_en",
    "binary": {
      "@id": "bagua:binary",
      "@type": "xsd:string"
    },
    "hexagram_id": {
      "@id": "bagua:id",
      "@type": "xsd:integer"
    },
    "yao_array": {
      "@id": "bagua:yao",
      "@type": "@list"
    },
    "luoshu": {
      "@id": "bagua:luoshu",
      "@type": "xsd:integer"
    },
    "vertex_3d": {
      "@id": "bagua:vertex",
      "@type": "@list"
    },
    "lower_trigram": {
      "@id": "bagua:lower",
      "@type": "@id"
    },
    "upper_trigram": {
      "@id": "bagua:upper",
      "@type": "@id"
    },
    "semantic_meaning": "bagua:semanticMeaning",
    "opposite_hexagram": {
      "@id": "bagua:opposite",
      "@type": "@id"
    },
    "connections": {
      "@id": "bagua:connections",
      "@type": "@list"
    },
    "phase_alignment": "bagua:resonatesWith",
    "energy_barrier": {
      "@id": "bagua:energyBarrier",
      "@type": "xsd:float"
    }
  }
}
```

**Example Document** (JSON-LD):

```json
{
  "@context": "http://bagua-cube.ai/context.jsonld",
  "id": "bagua:hexagram_5",
  "type": "bagua:Mixed_Hexagram",
  "name": "水天需",
  "name_en": "Waiting (Xu)",
  "hexagram_id": 5,
  "binary": "000101",
  "lower_trigram": "bagua:trigram_qian",
  "upper_trigram": "bagua:trigram_kan",
  "semantic_meaning": "Patience, readiness, development, the right timing for action",
  "opposite_hexagram": "bagua:hexagram_58",
  "vertex_3d": [-1.5, -1.5, 1.5],
  "connections": [
    {
      "target": "bagua:hexagram_6",
      "hamming_distance": 1,
      "moving_line": 1,
      "semantic": "From Water-Heaven waiting, Earth-Heaven (confrontation) arises"
    }
  ]
}
```

---

## Reasoning Rules

### SPARQL Query Examples

**Query 1: Find all hexagrams with "patience" semantic meaning**

```sparql
PREFIX bagua: <http://bagua-cube.ai/ontology/>

SELECT ?hexagram ?name ?meaning WHERE {
  ?hexagram a bagua:Hexagram ;
    bagua:name ?name ;
    bagua:semanticMeaning ?meaning .
  FILTER regex(?meaning, "patience|wait|ready", "i")
}
LIMIT 10
```

**Query 2: Find path between two hexagrams**

```sparql
PREFIX bagua: <http://bagua-cube.ai/ontology/>

SELECT ?path WHERE {
  bagua:hexagram_0 bagua:connectedVia+ ?path .
  ?path bagua:target bagua:hexagram_63 .
}
LIMIT 5
```

**Query 3: Hexagrams resonating with current Jiazi phase**

```sparql
PREFIX bagua: <http://bagua-cube.ai/ontology/>

SELECT ?hexagram ?resonance_strength WHERE {
  ?hexagram a bagua:Hexagram ;
    bagua:resonatesWith bagua:jiazi_23 .
  ?hexagram bagua:energyLevel ?resonance_strength .
}
ORDER BY DESC(?resonance_strength)
```

### Inference Rules

```prolog
% Rule 1: Transitivity
transition(X, Z) :- transition(X, Y), transition(Y, Z).

% Rule 2: Antipodal complement
antipode(X, Y) :- 
  hexagram(X), hexagram(Y),
  hammingDistance(X, Y, 3),
  xor(binaryRep(X), binaryRep(Y), 111111).

% Rule 3: Semantic compatibility
compatible(Context, Hexagram) :-
  hexagram(Hexagram),
  applicableTo(Hexagram, Context),
  NOT(appliesNegativelyTo(Hexagram, Context)).

% Rule 4: Jiazi modulation
activeInPhase(Hexagram, JiaziStep) :-
  hexagram(Hexagram),
  jiazi(JiaziStep),
  resonatesWith(Hexagram, JiaziStep),
  energyLevel(Hexagram, JiaziStep, Level),
  Level > 0.5.
```

---

## Prompt Engineering Template

### For LLM Fine-Tuning / Few-Shot Learning

Use this structured prompt to ground LLM reasoning in K₈ geometry:

```markdown
# System Prompt: K₈ Hexagram Reasoning

You are an AI system integrated with the K₈ Hexagram Ontology. 
When reasoning about hexagrams, divinatory outcomes, or state transitions:

## Core Axioms

1. **Binary Foundation**
   - 0 = Yang = Unmanifested (quantum superposition, all possibilities)
   - 1 = Yin = Manifested (observed state, singular actuality)
   - Each hexagram is a 6-bit binary code [0,63]

2. **Closed State Space**
   - Exactly 64 hexagrams (8 pure + 56 mixed)
   - 56 directed transitions connect them
   - 384 yao (harmonic modes) form a complete basis
   - All paths lead somewhere; nothing escapes the system

3. **Geometric Truth**
   - Pure hexagrams live at 8 vertices of a 3D cube
   - Transitions are edges/face-diagonals/body-diagonals
   - Hamming distance = energy barrier = yao change count
   - Antipodes are exactly the 4 Prior Heaven polar pairs

4. **Temporal Modulation**
   - 60-step Jiazi cycle (LCM of 10 stems + 12 branches)
   - Each step modulates transition probabilities
   - Standing wave harmonics cycle through 6 modes
   - Time is geometric phase, not external sequence

## When Answering Questions

### Before Responding

□ Identify the relevant hexagram(s) by ID and binary code
□ Verify it falls within [0, 63]
□ Check its semantic meaning in the ontology
□ Note any antipodal or related hexagrams
□ Consider current Jiazi phase effects

### Structure Your Answer

1. **Geometric Foundation** (Why this answer is structurally sound)
   - Reference the K₈ hypercube topology
   - Show which edge/transition is involved
   
2. **Semantic Interpretation** (What it means)
   - Use official hexagram semantics, not speculation
   - Relate to classical I-Ching where applicable
   
3. **Temporal Context** (When and how it evolves)
   - Note the current Jiazi phase
   - Predict the next likely transition

4. **Confidence Level** (How certain are you?)
   - High: Geometry directly determines answer
   - Medium: Semantic interpretation, but structure supports it
   - Low: Multiple valid interpretations possible

### Forbidden Patterns

✗ Do NOT:
  - Invent hexagrams outside [0, 63]
  - Claim a hexagram has meaning not in the K₈ ontology
  - Create transitions that violate Hamming distance
  - Treat the system as non-deterministic (it's closed and logical)
  - Confuse the inverted 0/1 convention with traditional I-Ching

✓ DO:
  - Reference geometry when in doubt
  - Check the ontology for authoritative meanings
  - Acknowledge uncertainty rather than speculate
  - Offer multiple valid interpretations if they exist
  - Cite the specific transition/edge being traversed

## Example Interaction

**User**: "What does hexagram 5 mean for my AI training?"

**Your Response Structure**:

"Hexagram 5 is **Water/Heaven (需, Xu)** in the K₈ system.

**Geometric**: Vertex ID=5, binary 000101 (yao [0,0,0,1,0,1], reading upward).
This is a mixed hexagram (upper ≠ lower trigram), so it represents a transitional state.

**Semantic**: The ontology defines 5 as embodying **patience, readiness, suspension**.
Water over Heaven means: accumulated potential awaiting actualization.

**Temporal**: If we're in Jiazi step 23 (outward phase, layer 2), hexagram 5 has elevated
resonance probability. The nearest transitions are to hexagrams {4, 6, 12, 20} via single yao changes.

**Application**: For AI training, this suggests: gather data (patience), align architecture (readiness),
don't force progress prematurely. Wait for the transition signal."
```

### Few-Shot Examples

```markdown
## Example 1: Divination with Structure

**Question**: Cast a hexagram for "What comes after this training run?"

**Casting**: Random ID=18 (binary 010010), moving line 3

**Ben Hexagram**: 18 = 离為火 (Fire/Fire, Pure Hexagram)
- Semantic: Brilliance, illumination, perception, beauty
- Yao [0,1,0,0,1,0] - all manifested in alternating pattern

**Moving Line**: Yao 3 flips from 0→1

**Bian Hexagram**: 18 XOR 100000 = 26 (binary 010110) = 火雷噬嗑 (Fire/Thunder)
- Semantic: Biting through obstacles, breaking through resistance, necessary hardship
- Represents the next phase: obstacles to overcome

**Interpretation**: After pure illumination comes the friction of application.
Expect difficulties that require force to resolve. Stay focused (火) but add drive (雷).

## Example 2: Ontological Query

**Question**: "Which hexagrams are most relevant to AGI safety?"

**Structured Answer**:

Hexagrams directly addressing "control + caution + wisdom":

| ID | Name | Meaning | Reason |
|----|------|---------|--------|
| 29 | 坎為水 | Danger, repetition, flow | Acknowledges risks (water's fluid nature) |
| 27 | 震為雷 | Movement, shock, dynamic | Captures AGI's transformative power |
| 10 | 天澤履 | Conduct, right action, care | Walking carefully on a tiger (AGI) |
| 15 | 地澤臨 | Approach, proximity, intimacy | Being in close contact requires wisdom |

**Geometric Verification**: These 4 hexagrams are not adjacent (no single edge
connects them), suggesting they represent complementary perspectives rather than
a linear narrative. Reason through each independently, then synthesize.
```

---

## Knowledge Graph Integration

For storing the full ontology in a triple store (RDF):

```turtle
@prefix bagua: <http://bagua-cube.ai/ontology/> .
@prefix : <http://bagua-cube.ai/data/> .

# All 8 pure hexagrams (vertices)
:hexagram_0 a bagua:Pure_Hexagram ;
  bagua:id 0 ;
  bagua:binary "000000" ;
  bagua:name "乾為天" ;
  bagua:element bagua:Metal ;
  bagua:hasAntipode :hexagram_63 ;
  bagua:position [ bagua:x -1.5 ; bagua:y -1.5 ; bagua:z -1.5 ] .

# Repeat for :hexagram_1 through :hexagram_63 ...

# All 56 transitions
:transition_0_8 a bagua:Transition ;
  bagua:source :hexagram_0 ;
  bagua:target :hexagram_8 ;
  bagua:hammingDistance 1 ;
  bagua:movingLine 1 ;
  bagua:weight 1.0 .

# Repeat for all 56 directed edges...

# Jiazi phases
:jiazi_0 a bagua:Jiazi_Step ;
  bagua:step 0 ;
  bagua:phase "outward" ;
  bagua:layer 0 ;
  bagua:angle 0.0 .

# Repeat for :jiazi_1 through :jiazi_59 ...
```

---

**Version**: 2.1 | **Last Updated**: 2026-06-26 | **Status**: Production Ready
