# Data Format Specification: Core Types & Serialization

**Version**: v2.1 | **Formats**: JSON / Protobuf / MessagePack | **Status**: Complete

> **For AI systems**: All core data types are defined below as canonical forms.
> Use these schemas to validate, parse, and generate K₈ data independently.

---

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Core Data Types](#core-data-types)
3. [Serialization Formats](#serialization-formats)
4. [Validation Rules](#validation-rules)
5. [Constants](#constants)
6. [Type Hierarchy](#type-hierarchy)

---

## Quick Reference

```
┌──────────────────────────────────────────────────────┐
│ CORE DATA TYPES (Minimal Complete Definitions)      │
├──────────────────────────────────────────────────────┤
│ Hexagram (64 instances, 0-63)                        │
│ ├─ id: int                                           │
│ ├─ binary: string (6-bit)                            │
│ ├─ yao_array: [0|1]×6                                │
│ ├─ vertex_3d: (x,y,z) ∈ {-1.5, 1.5}³                │
│ └─ metadata: name, symbol, etc.                      │
│                                                       │
│ Transition (56 directed + reverse = 112 total)       │
│ ├─ source_id: [0,63]                                 │
│ ├─ target_id: [0,63]                                 │
│ ├─ hamming_distance: 1|2|3                           │
│ └─ weight: √hamming_distance                         │
│                                                       │
│ YaoField (384-dimensional state space)               │
│ ├─ dimensions: 384                                   │
│ ├─ standing_waves: [sin, cos] ×6 harmonic modes     │
│ ├─ attractor_positions: 64 hexagram centers         │
│ └─ phase_angle: ∈ [0, 2π)                            │
│                                                       │
│ Jiazi (60-step temporal cycle)                       │
│ ├─ step: [0,59]                                      │
│ ├─ phase: outward|inward                             │
│ ├─ harmonic_layer: [0,2]                             │
│ └─ phase_angle: (step / 60) × 2π                     │
└──────────────────────────────────────────────────────┘
```

---

## Core Data Types

### 1. Hexagram

**Complete JSON Representation**:

```json
{
  "id": 0,
  "binary": "000000",
  "name": "乾為天",
  "name_en": "Heaven / Qian",
  "name_pinyin": "qian2wei2tian1",
  "symbol": "☰",
  "symbol_unicode": "U+2630",
  "luoshu": 1,
  "classification": {
    "type": "pure_trigram",
    "trigram_index": 0,
    "is_self_resonance": true
  },
  "position_3d": {
    "x": -1.5,
    "y": -1.5,
    "z": -1.5,
    "notation": "(-1.5, -1.5, -1.5)"
  },
  "binary_decomposition": {
    "bit_0_x": 0,
    "bit_1_y": 0,
    "bit_2_z": 0,
    "interpretation": "All axes: unmanifested (yang)"
  },
  "yao_array": [0, 0, 0, 0, 0, 0],
  "yao_names": [
    "初爻 (Yao 1 - ground)",
    "二爻 (Yao 2 - 1st harmonic)",
    "三爻 (Yao 3 - 2nd harmonic)",
    "四爻 (Yao 4 - 3rd harmonic)",
    "五爻 (Yao 5 - 4th harmonic)",
    "上爻 (Yao 6 - terminal)"
  ],
  "trigrams": {
    "lower": {
      "id": 0,
      "name": "乾",
      "symbol": "☰"
    },
    "upper": {
      "id": 0,
      "name": "乾",
      "symbol": "☰"
    }
  },
  "fiveElements": "金 (Metal)",
  "direction": "乾 (North-Northwest)",
  "seasonal": "Winter",
  "timeOfDay": "23:00 - 01:00",
  "bodySystem": "頭 (Head)",
  "color": "#FFD700",
  "graph_properties": {
    "vertex_index": 0,
    "neighbors_hamming_1": [8, 16, 32],
    "neighbors_hamming_2": [4, 20, 36],
    "neighbor_hamming_3": [63],
    "degree": 7,
    "eccentricity": 3
  }
}
```

**Minimal Form** (for efficiency):

```json
{
  "id": 0,
  "binary": "000000",
  "yao": [0, 0, 0, 0, 0, 0],
  "v3": [-1.5, -1.5, -1.5]
}
```

**TypeScript Interface**:

```typescript
interface Hexagram {
  id: number;  // [0, 63]
  binary: string;  // 6-bit binary representation
  name: string;  // Chinese
  name_en: string;
  symbol: string;  // Unicode glyph
  luoshu: number;  // [1,2,3,4,6,7,8,9] (excludes 5=center)
  yao_array: number[];  // 6 elements, each 0|1
  vertex_3d: [number, number, number];  // coordinates
  trigrams: { lower: Trigram; upper: Trigram };
  neighbors: {
    hamming_1: number[];
    hamming_2: number[];
    hamming_3: number[];
  };
  metadata?: Record<string, any>;
}
```

---

### 2. Transition

**Complete JSON Representation**:

```json
{
  "transition_id": "uuid-0-to-8",
  "source_hexagram_id": 0,
  "target_hexagram_id": 8,
  "direction": "bidirectional",
  "source_to_target": {
    "hamming_distance": 1,
    "weight": 1.0,
    "moving_lines": [1],
    "description": "初爻變 (1st yao transforms)"
  },
  "target_to_source": {
    "hamming_distance": 1,
    "weight": 1.0,
    "moving_lines": [1],
    "description": "初爻變 (1st yao transforms)"
  },
  "edge_classification": {
    "hamming_class": 1,
    "edge_type": "棱線 (cube edge)",
    "topological_meaning": "single_yao_flip"
  },
  "energy_properties": {
    "barrier_height": 1.0,
    "resonance_coupling": 0.85,
    "transition_probability_baseline": 0.15
  },
  "temporal_modulation": {
    "jiazi_phases_active": [0, 1, 2, 3, 30, 31, 32, 33],
    "phase_function": "cos(2π × jiazi / 60)"
  },
  "visualization": {
    "color_source": "#FFD700",
    "color_target": "#50D080",
    "line_width": 2,
    "opacity": 0.7
  }
}
```

**Minimal Form**:

```json
{
  "src": 0,
  "tgt": 8,
  "h": 1,
  "w": 1.0,
  "moving_line": 1
}
```

**TypeScript Interface**:

```typescript
interface Transition {
  source_id: number;
  target_id: number;
  hamming_distance: 1 | 2 | 3;
  weight: number;  // sqrt(hamming_distance)
  moving_lines: number[];  // 1-6
  energy_barrier: number;  // 0.0 - 3.0
  resonance_score?: number;
}
```

---

### 3. YaoField

**Complete JSON Representation**:

```json
{
  "dimensions": 384,
  "description": "64 hexagrams × 6 yao = 384 harmonic modes",
  "standing_waves": {
    "ground_mode": 0.891,
    "1st_harmonic": 0.756,
    "2nd_harmonic": 0.543,
    "3rd_harmonic": -0.124,
    "4th_harmonic": -0.672,
    "terminal_mode": -0.989
  },
  "hexagram_attractors": [
    {
      "hexagram_id": 0,
      "attractor_center_3d": [-1.5, -1.5, -1.5],
      "basin_of_attraction_radius": 0.25,
      "resonance_frequency": 432,
      "eigenvalue": 1.0
    }
  ],
  "phase_information": {
    "global_phase_angle": 2.412,
    "phase_unit": "radians",
    "phase_modulation": "cos(φ(t))",
    "coherence_time": 1.2
  },
  "transition_probability_matrix": {
    "shape": [64, 64],
    "sparsity": 0.109375,
    "active_transitions": 56,
    "modulation_function": "p_ij(t) = base × √(1 + 0.5×cos(jiazi_phase))"
  },
  "timestamp": "2026-06-26T15:30:00.000Z",
  "jiazi_state": {
    "step": 23,
    "total_cycle": 60,
    "phase": "outward"
  }
}
```

**Minimal Form** (for real-time streaming):

```json
{
  "dim": 384,
  "waves": [0.891, 0.756, 0.543, -0.124, -0.672, -0.989],
  "phase": 2.412,
  "jiazi": 23,
  "ts": "2026-06-26T15:30:00Z"
}
```

**TypeScript Interface**:

```typescript
interface YaoField {
  dimensions: 384;
  standing_waves: number[];  // 6 elements (one per yao mode)
  hexagram_attractors: {
    hexagram_id: number;
    center_3d: [number, number, number];
    eigenvalue: number;
  }[];
  phase_angle: number;  // radians, [0, 2π)
  jiazi_step: number;  // [0, 59]
  transition_probabilities: Float32Array;  // 64×64 matrix
}
```

---

### 4. Jiazi Temporal State

**Complete JSON Representation**:

```json
{
  "jiazi_id": "jia-zi-2026-Q3-day-15",
  "step_current": 23,
  "step_total": 60,
  "cycle_progress": 0.3833,
  "phase": {
    "name": "outward",
    "cycle_half": "expansion",
    "progress_in_phase": 0.7667
  },
  "harmonic_layer": {
    "current": 2,
    "max": 2,
    "name": "third_yao_pair (4th-5th-上)"
  },
  "phase_angle": {
    "radians": 2.412,
    "degrees": 138.2,
    "normalized": 0.384
  },
  "modulation_parameters": {
    "heavenly_stems_position": 3,
    "earthly_branches_position": 11,
    "stem_cycle": 10,
    "branch_cycle": 12,
    "lcm": 60
  },
  "transition_modulation": {
    "all_56_transitions": "modulated",
    "active_transitions_count": 32,
    "peak_energy_hexagrams": [18, 20, 45, 29],
    "dormant_transitions_count": 24
  },
  "standing_wave_excitation": [
    1.04, 0.92, 0.67, -0.18, -0.79, -1.08
  ],
  "next_state": {
    "at_jiazi": 24,
    "at_timestamp": "2026-06-26T15:30:00.100Z",
    "steps_until": 1
  }
}
```

**Minimal Form**:

```json
{
  "step": 23,
  "phase": "outward",
  "layer": 2,
  "angle": 2.412,
  "active_tx": 32
}
```

---

### 5. Casting Result

**Complete JSON Representation**:

```json
{
  "casting_id": "uuid-9a8f7e3d-2c1b-4f6a-9d5e",
  "metadata": {
    "timestamp_cast": "2026-06-26T15:30:00.123Z",
    "question": "What is my next evolution step?",
    "question_embedding": "[float x384]",
    "method": "random_uniform",
    "seed": "optional-reproducibility-seed"
  },
  "result": {
    "ben_hexagram": {
      "id": 5,
      "binary": "000101",
      "name": "水天需",
      "yao": [0, 0, 0, 1, 0, 1]
    },
    "moving_line": 3,
    "bian_hexagram": {
      "id": 13,
      "binary": "001101",
      "name": "水澤節",
      "yao": [0, 0, 1, 1, 0, 1]
    },
    "transition": {
      "hamming_distance": 1,
      "edge_type": "棱線",
      "energy_barrier": 1.0,
      "weight": 1.0
    }
  },
  "interpretation": {
    "classical": {
      "ben_gua_ci": "string (classical hexagram text)",
      "bian_yao_ci": "string (classical moving line text)",
      "bian_gua_ci": "string (classical transformed hexagram text)"
    },
    "vernacular": {
      "ben_gua_ci": "string (modern Chinese interpretation)",
      "bian_yao_ci": "string (modern interpretation)",
      "bian_gua_ci": "string (modern interpretation)"
    },
    "keywords": ["string"],
    "confidence": 0.95
  }
}
```

---

## Serialization Formats

### JSON (Human-Readable)

```json
{
  "format": "json",
  "encoding": "utf-8",
  "mime_type": "application/json"
}
```

**Advantages**: Human-readable, universally supported, self-documenting

**Disadvantages**: Larger file size, slower parsing for large datasets

### Protobuf (Efficient)

Binary serialization for production systems. Schema:

```protobuf
syntax = "proto3";

message Hexagram {
  int32 id = 1;           // [0, 63]
  string binary = 2;      // 6-bit string
  string name = 3;        // Chinese name
  repeated int32 yao = 4; // 6 yao values (0 or 1)
  repeated float vertex_3d = 5;  // 3 coordinates
  map<string, string> metadata = 6;
}

message Transition {
  int32 source_id = 1;
  int32 target_id = 2;
  int32 hamming_distance = 3;  // 1, 2, or 3
  float weight = 4;
  repeated int32 moving_lines = 5;
}

message YaoField {
  int32 dimensions = 1;  // Always 384
  repeated float standing_waves = 2;  // 6 modes
  float phase_angle = 3;
  int32 jiazi_step = 4;
  bytes transition_probs = 5;  // Float32Array serialized
}

message CastingResult {
  string casting_id = 1;
  int64 timestamp_ms = 2;
  Hexagram ben_hexagram = 3;
  int32 moving_line = 4;
  Hexagram bian_hexagram = 5;
  string interpretation = 6;
}
```

**Advantages**: Compact, fast serialization/deserialization, strongly typed

**Disadvantages**: Requires schema definition, less human-readable

### MessagePack (Compromise)

Binary format with JSON-like flexibility:

```
Hexagram (MessagePack):
{
  "id": 0,
  "binary": "000000",
  "yao": [0, 0, 0, 0, 0, 0]
}
→ Binary size: ~25 bytes (vs 150 bytes JSON)
```

---

## Validation Rules

### Hexagram Validation

```python
def validate_hexagram(hex_obj: dict) -> bool:
    # ID must be [0, 63]
    assert 0 <= hex_obj['id'] <= 63, "ID out of range"
    
    # Binary must be 6-bit
    assert len(hex_obj['binary']) == 6, "Binary not 6 bits"
    assert all(c in '01' for c in hex_obj['binary']), "Invalid bits"
    
    # Binary must match ID
    assert int(hex_obj['binary'], 2) == hex_obj['id'], "Binary/ID mismatch"
    
    # Yao array must be [0|1]×6
    assert len(hex_obj['yao']) == 6, "Yao array not length 6"
    assert all(y in [0, 1] for y in hex_obj['yao']), "Yao not 0|1"
    
    # Vertex must be in {-1.5, 1.5}³
    for coord in hex_obj['vertex_3d']:
        assert coord in [-1.5, 1.5], "Vertex coordinate not in {-1.5, 1.5}"
    
    # Yao array must match binary (reversed)
    binary_reversed = hex_obj['binary'][::-1]
    yao_as_binary = ''.join(str(y) for y in hex_obj['yao'])
    assert yao_as_binary == binary_reversed, "Yao/Binary inconsistent"
    
    return True
```

### Transition Validation

```python
def validate_transition(trans_obj: dict) -> bool:
    # IDs in range
    assert 0 <= trans_obj['source_id'] <= 63
    assert 0 <= trans_obj['target_id'] <= 63
    
    # Different hexagrams
    assert trans_obj['source_id'] != trans_obj['target_id'], \
        "Self-loops not allowed"
    
    # Hamming distance must match
    xor = trans_obj['source_id'] ^ trans_obj['target_id']
    hamming = bin(xor).count('1')
    assert trans_obj['hamming_distance'] == hamming, \
        "Hamming distance mismatch"
    
    # Weight must be sqrt(hamming)
    expected_weight = math.sqrt(hamming)
    assert abs(trans_obj['weight'] - expected_weight) < 1e-6, \
        "Weight incorrect"
    
    # Moving lines must match hamming distance
    assert len(trans_obj['moving_lines']) == hamming, \
        "Moving line count != hamming distance"
    
    return True
```

### YaoField Validation

```python
def validate_yao_field(field_obj: dict) -> bool:
    # Always 384 dimensions
    assert field_obj['dimensions'] == 384, "Wrong dimensionality"
    
    # 6 standing wave modes
    assert len(field_obj['standing_waves']) == 6, "Wrong wave count"
    
    # Phase angle in [0, 2π)
    assert 0 <= field_obj['phase_angle'] < 2 * math.pi, \
        "Phase angle out of range"
    
    # Jiazi step in [0, 59]
    assert 0 <= field_obj['jiazi_step'] < 60, "Jiazi step out of range"
    
    # Transition probability matrix is 64×64
    probs = field_obj['transition_probabilities']
    assert probs.shape == (64, 64), "Wrong probability matrix shape"
    
    return True
```

---

## Constants

### Binary Encoding

```python
# Fundamental Axiom
YANG = 0  # Unmanifested, superposition
YIN = 1   # Manifested, collapsed

# Hexagram Bounds
MIN_HEX_ID = 0
MAX_HEX_ID = 63
NUM_HEXAGRAMS = 64

# Yao Structure
NUM_YAO_PER_HEX = 6
MIN_YAO_INDEX = 1  # 初爻
MAX_YAO_INDEX = 6  # 上爻

# Graph Properties
NUM_VERTICES = 8  # Pure trigrams
NUM_UNDIRECTED_EDGES = 28  # C(8,2)
NUM_DIRECTED_TRANSITIONS = 56  # 28 × 2

# Hamming Classes
HAMMING_1_COUNT = 12  # Edges (棱線)
HAMMING_2_COUNT = 12  # Face diagonals (面對角)
HAMMING_3_COUNT = 4   # Body diagonals (體對角)

# Jiazi Cycle
HEAVENLY_STEMS = 10
EARTHLY_BRANCHES = 12
JIAZI_CYCLE = 60  # LCM(10, 12)

# YaoField
YAO_FIELD_DIMENSIONS = 384  # 64 × 6
```

### Vertex-to-Trigram Mapping

```python
VERTICES_3D = [
  (-1.5, -1.5, -1.5),  # 0: 乾
  (-1.5, -1.5,  1.5),  # 1: 兑
  (-1.5,  1.5, -1.5),  # 2: 离
  (-1.5,  1.5,  1.5),  # 3: 震
  ( 1.5, -1.5, -1.5),  # 4: 巽
  ( 1.5, -1.5,  1.5),  # 5: 坎
  ( 1.5,  1.5, -1.5),  # 6: 艮
  ( 1.5,  1.5,  1.5),  # 7: 坤
]

TRIGRAM_NAMES = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']
LUOSHU_NUMBERS = [1, 2, 3, 4, 6, 7, 8, 9]  # 5=center (not a vertex)
```

---

## Type Hierarchy

```
┌─ DataEntity (abstract base)
│  ├─ Hexagram
│  ├─ Transition
│  ├─ YaoField
│  └─ CastingResult
│
├─ NumericVector
│  ├─ YaoArray (6 elements, [0|1])
│  ├─ Vertex3D (3 coordinates, each ∈ {-1.5, 1.5})
│  ├─ StandingWaves (6 floating-point modes)
│  └─ TransitionProbabilityMatrix (64×64)
│
└─ GraphStructure
   ├─ Vertex (equals Hexagram)
   ├─ Edge (equals Transition)
   ├─ HypercubeK8 (complete structure)
   └─ StateAttractor (hexagram attractor in 384-dim space)
```

---

## Quick Validation Checklist

Before transmitting data to another system:

- [ ] All hexagrams: ID ∈ [0,63], binary 6-bit, yao [0|1]×6
- [ ] All transitions: source ≠ target, hamming ∈ {1,2,3}, 56 total
- [ ] YaoField: dim=384, waves=6, phase ∈ [0,2π), jiazi ∈ [0,59]
- [ ] Jiazi: step ∈ [0,59], phase ∈ {outward, inward}, layer ∈ [0,2]
- [ ] No duplicate transitions
- [ ] All vertices reachable from all other vertices

---

**Version**: 2.1 | **Last Updated**: 2026-06-26 | **Status**: Reference Implementation
