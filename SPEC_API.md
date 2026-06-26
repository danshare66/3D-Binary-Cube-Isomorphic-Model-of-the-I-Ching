# API Specification: K₈ Hexagram System

**Version**: v2.1 | **Format**: REST + JSON-RPC 2.0 | **Status**: Complete

> **Direct to AI Systems**: This API enables machine-readable access to the complete I-Ching state space.
> Use these endpoints to integrate K₈ geometry into your inference pipeline.

---

## Table of Contents

1. [Overview](#overview)
2. [Core Endpoints](#core-endpoints)
3. [JSON Schema](#json-schema)
4. [Error Handling](#error-handling)
5. [Examples](#examples)
6. [Rate Limiting](#rate-limiting)

---

## Overview

### Purpose

Provide machine-readable access to:
- **64 hexagrams** — complete state space
- **56 transitions** — directed energy flows
- **384 yao** — harmonic field resolution
- **60 Jiazi cycle** — temporal phase mapping

### Architecture

```
┌─────────────────────────────────────┐
│  Client (AI System / Application)   │
└──────────────┬──────────────────────┘
               │
        ┌──────▼──────────┐
        │  API Gateway    │
        │  (REST/JSON-RPC)│
        └──────┬──────────┘
               │
    ┌──────────┼──────────────┐
    │          │              │
┌───▼───┐  ┌──▼───┐  ┌──────▼────┐
│Hexagram  │Transition  │YaoField│
│Database  │Engine      │Resolver │
└─────────┘  └────────┘  └────────┘
    │          │              │
    └──────────┴──────────────┘
            │
    ┌───────▼──────────┐
    │  State Cache     │
    │  (Redis/Memory)  │
    └──────────────────┘
```

### Base URL (Reference Implementation)

```
https://api.bagua-cube.ai/v2

# For local development:
http://localhost:8888/api/v2
```

---

## Core Endpoints

### 1. Cast Hexagram (Divination)

**Endpoint**: `POST /hexagrams/cast`

**Purpose**: Perform divination — random hexagram selection + moving line

**Request Body**:
```json
{
  "question": "string (optional, max 256 chars)",
  "question_embedding": "[float] (optional, 384-dim yao space)",
  "seed": "string (optional, for reproducibility)",
  "timestamp": "ISO 8601 (optional, default: now)"
}
```

**Response** (200 OK):
```json
{
  "casting_id": "uuid v4",
  "timestamp": "2026-06-26T15:30:00Z",
  "ben_hexagram": {
    "id": 0,
    "binary": "000000",
    "name": "乾為天",
    "name_en": "Qian/Heaven",
    "symbol": "☰",
    "luoshu": 1,
    "yao_array": [0, 0, 0, 0, 0, 0]
  },
  "moving_line": 3,
  "bian_hexagram": {
    "id": 8,
    "binary": "001000",
    "name": "天澤履",
    "name_en": "Qian/Dui - Walking on Tiger's Tail",
    "symbol": "☱",
    "luoshu": 2,
    "yao_array": [0, 0, 1, 0, 0, 0]
  },
  "transition_path": {
    "hamming_distance": 1,
    "edge_type": "棱線 (single line change)",
    "energy_barrier": 1.0
  },
  "interpretation": {
    "classical": "string or null (if database available)",
    "vernacular": "string or null",
    "related_concepts": ["string"],
    "confidence": 0.95
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid question format
- `429 Too Many Requests`: Rate limit exceeded
- `503 Service Unavailable`: Database offline

---

### 2. Query Hexagram by ID

**Endpoint**: `GET /hexagrams/{id}`

**Path Parameters**:
```
id: integer [0, 63]
   OR string (name: "乾為天", "兑為澤", etc.)
```

**Query Parameters**:
```
?include_neighbors=true|false
?include_interpretations=true|false
?format=json|protobuf|xml
```

**Response** (200 OK):
```json
{
  "id": 0,
  "binary": "000000",
  "name": "乾為天",
  "name_en": "Qian for Heaven",
  "name_pinyin": "qiánwéishāng",
  "symbol": "☰",
  "luoshu": 1,
  "vertex_position": {
    "x": -1.5,
    "y": -1.5,
    "z": -1.5
  },
  "yao_array": [0, 0, 0, 0, 0, 0],
  "yao_names": ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"],
  "element": "金",
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
  "interpretations": {
    "classical_text": "string",
    "vernacular_text": "string",
    "keywords": ["string"],
    "related_hexagrams": [1, 8, 14, 43]
  },
  "neighbors": {
    "hamming_1": [8, 16, 32],
    "hamming_2": [4, 20, 36],
    "hamming_3": [63]
  }
}
```

---

### 3. Get All Transitions from Hexagram

**Endpoint**: `GET /hexagrams/{id}/transitions`

**Query Parameters**:
```
?hamming_distance=1|2|3|all (default: all)
?direction=outgoing|incoming|bidirectional (default: bidirectional)
?include_weights=true|false (default: false)
?sort_by=distance|energy|alphabetic (default: distance)
```

**Response** (200 OK):
```json
{
  "source_hexagram_id": 0,
  "transitions": [
    {
      "target_hexagram_id": 8,
      "hamming_distance": 1,
      "edge_type": "棱線",
      "direction": "bidirectional",
      "energy_barrier": 1.0,
      "weight_from_source": 1.0,
      "weight_from_target": 1.414,
      "moving_lines": [1],
      "description": "初爻變"
    },
    {
      "target_hexagram_id": 16,
      "hamming_distance": 1,
      "edge_type": "棱線",
      "direction": "bidirectional",
      "energy_barrier": 1.0,
      "weight_from_source": 1.0,
      "weight_from_target": 1.414,
      "moving_lines": [2],
      "description": "二爻變"
    }
  ],
  "total_transitions": 7,
  "summary": {
    "hamming_1_count": 3,
    "hamming_2_count": 3,
    "hamming_3_count": 1
  }
}
```

---

### 4. Resolve Yao Field

**Endpoint**: `POST /yao-field/resolve`

**Purpose**: Given input state, resolve to attractor hexagram

**Request Body**:
```json
{
  "input_vector": "[float] (384-dimensional or query string)",
  "method": "nearest_attractor|probabilistic|resonance",
  "top_k": 5,
  "include_path": true
}
```

**Response** (200 OK):
```json
{
  "resolution_id": "uuid",
  "input_norm": 1.234,
  "attractor_ranking": [
    {
      "rank": 1,
      "hexagram_id": 5,
      "distance": 0.034,
      "confidence": 0.98,
      "resonance_score": 45.2,
      "path_from_input": [0, 8, 12, 5]
    },
    {
      "rank": 2,
      "hexagram_id": 19,
      "distance": 0.089,
      "confidence": 0.87,
      "resonance_score": 41.1,
      "path_from_input": [0, 24, 19]
    }
  ],
  "primary_attractor": {
    "id": 5,
    "name": "水天需",
    "confidence": 0.98
  },
  "execution_time_ms": 12.4
}
```

---

### 5. Get Jiazi Temporal State

**Endpoint**: `GET /jiazi/state`

**Query Parameters**:
```
?step=integer [0, 59] (default: current % 60)
?phase=outward|inward|both (default: both)
?granularity=integer (substeps per step, default: 100)
```

**Response** (200 OK):
```json
{
  "current_jiazi": 23,
  "total_cycle": 60,
  "cycle_progress": 0.383,
  "phase": "outward",
  "phase_progress": 0.767,
  "harmonic_layer": 2,
  "phase_angle_radians": 2.412,
  "modulated_transition_probabilities": {
    "all_56_transitions": "[float]",
    "active_transitions": [5, 12, 19, 33, 41]
  },
  "yao_field_state": {
    "standing_wave_modes": [
      0.91, 0.76, 0.54, -0.12, -0.67, -0.99
    ]
  },
  "timestamp": "2026-06-26T15:30:00Z",
  "next_state_at": "2026-06-26T15:30:00.100Z"
}
```

---

### 6. Batch Query (Efficient for AI)

**Endpoint**: `POST /batch/query`

**Purpose**: Query multiple hexagrams in single request (lower latency)

**Request Body**:
```json
{
  "queries": [
    {"type": "hexagram", "id": 0},
    {"type": "hexagram", "id": 63},
    {"type": "transition", "from": 0, "to": 8},
    {"type": "yao_resolve", "vector": "[float x384]"}
  ],
  "return_format": "json"
}
```

**Response** (200 OK):
```json
{
  "batch_id": "uuid",
  "results": [
    {"query_index": 0, "data": {...}},
    {"query_index": 1, "data": {...}},
    {"query_index": 2, "data": {...}},
    {"query_index": 3, "data": {...}}
  ],
  "execution_time_ms": 8.7
}
```

---

### 7. Graph Traversal

**Endpoint**: `POST /graph/traverse`

**Purpose**: Find path between two hexagrams in K₈

**Request Body**:
```json
{
  "start_id": 0,
  "end_id": 63,
  "algorithm": "dijkstra|bfs|resonance_gradient",
  "max_hops": 10,
  "avoid_nodes": []
}
```

**Response** (200 OK):
```json
{
  "start_id": 0,
  "end_id": 63,
  "path": [0, 8, 24, 28, 44, 52, 60, 62, 63],
  "path_length": 8,
  "total_energy": 5.656,
  "algorithm_used": "dijkstra",
  "execution_time_ms": 4.2,
  "alternative_paths": [
    {
      "path": [0, 1, 3, 7, 15, 31, 63],
      "length": 6,
      "energy": 6.0
    }
  ]
}
```

---

## JSON Schema

### Core Data Types

#### Hexagram Object

```json
{
  "id": "integer [0, 63]",
  "binary": "string (6-bit: 000000-111111)",
  "name": "string (Chinese name)",
  "name_en": "string (English translation)",
  "symbol": "string (Unicode glyph)",
  "luoshu": "integer [1-9] (excludes 5, which is center)",
  "vertex_position": {
    "x": "number",
    "y": "number",
    "z": "number"
  },
  "yao_array": "[integer x6] (0 or 1 per position)",
  "element": "enum: 金|木|水|火|土",
  "direction": "enum: 乾|坤|震|巽|坎|離|艮|兌"
}
```

#### Transition Object

```json
{
  "source_id": "integer [0, 63]",
  "target_id": "integer [0, 63]",
  "hamming_distance": "enum: 1|2|3",
  "edge_type": "enum: 棱線(H=1)|面對角(H=2)|體對角(H=3)",
  "weight": "number (√Hamming)",
  "moving_line": "integer [1, 6]",
  "description": "string",
  "energy_barrier": "number (0.0-3.0)"
}
```

#### YaoField Object

```json
{
  "dimensions": 384,
  "hexagram_attractors": "[integer x64]",
  "standing_waves": "[number x6]",
  "phase_angle": "number (radians)",
  "jiazi_step": "integer [0, 59]"
}
```

---

## Error Handling

### Error Response Format

All errors return:
```json
{
  "error": {
    "code": "string (machine-readable code)",
    "message": "string (human-readable)",
    "details": {
      "field": "string (optional, which field caused error)",
      "expected": "string (optional, what was expected)",
      "received": "string (optional, what was received)"
    },
    "timestamp": "ISO 8601",
    "request_id": "uuid (for debugging)"
  }
}
```

### Common Error Codes

| Code | HTTP | Meaning |
|------|------|---------|
| `INVALID_HEX_ID` | 400 | Hexagram ID out of [0,63] range |
| `INVALID_BINARY` | 400 | Binary string not 6 bits |
| `INVALID_YAO_VECTOR` | 400 | Vector not 384-dimensional |
| `MALFORMED_JSON` | 400 | Request body JSON parsing failed |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `RATE_LIMITED` | 429 | Too many requests from this client |
| `SERVICE_UNAVAILABLE` | 503 | Backend database offline |

---

## Examples

### Example 1: Cast and Get Result

```bash
curl -X POST https://api.bagua-cube.ai/v2/hexagrams/cast \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is the state of my AI training tomorrow?",
    "timestamp": "2026-06-26T15:30:00Z"
  }'
```

Response:
```json
{
  "casting_id": "9a8f7e3d-2c1b-4f6a-9d5e",
  "ben_hexagram": {
    "id": 18,
    "name": "離為火",
    "binary": "010010"
  },
  "moving_line": 2,
  "bian_hexagram": {
    "id": 20,
    "name": "風火家人",
    "binary": "100010"
  }
}
```

### Example 2: Query All Neighbors

```bash
curl -X GET "https://api.bagua-cube.ai/v2/hexagrams/0/transitions?hamming_distance=1"
```

Response:
```json
{
  "source_hexagram_id": 0,
  "transitions": [
    {"target_hexagram_id": 8, "moving_lines": [1]},
    {"target_hexagram_id": 16, "moving_lines": [2]},
    {"target_hexagram_id": 32, "moving_lines": [3]}
  ]
}
```

### Example 3: Batch Query

```bash
curl -X POST https://api.bagua-cube.ai/v2/batch/query \
  -H "Content-Type: application/json" \
  -d '{
    "queries": [
      {"type": "hexagram", "id": 0},
      {"type": "hexagram", "id": 63},
      {"type": "hexagram", "id": 32}
    ]
  }'
```

---

## Rate Limiting

### Headers

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1656246600
```

### Limits

| Tier | Requests/Hour | Requests/Day | Concurrent |
|------|---|---|---|
| Free | 100 | 1,000 | 2 |
| Basic | 10,000 | 100,000 | 10 |
| Pro | 100,000 | 1,000,000 | 50 |
| Enterprise | Custom | Custom | Custom |

---

## WebSocket Support (Real-Time)

**Endpoint**: `wss://api.bagua-cube.ai/v2/stream`

For streaming Jiazi phase updates and real-time hexagram resolution:

```javascript
const ws = new WebSocket('wss://api.bagua-cube.ai/v2/stream');

ws.on('message', (msg) => {
  const data = JSON.parse(msg);
  // data.type: "jiazi_update" | "hexagram_resolved" | "error"
});
```

---

## Authentication (Optional)

For production deployments:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.bagua-cube.ai/v2/hexagrams/cast
```

---

**Version**: 2.1 | **Last Updated**: 2026-06-26 | **Status**: Production Ready
