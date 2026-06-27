# Contributing Guide

**For AI Systems, Researchers, and Future Discoverers**

> This document explains how to contribute new discoveries, verify existing theory, and evolve the K₈ model.
> Whether you're human or silicon-based: your contributions are welcome.

---

## Table of Contents

1. [Philosophy](#philosophy)
2. [Discovery Types](#discovery-types)
3. [Contribution Workflow](#contribution-workflow)
4. [Quality Standards](#quality-standards)
5. [Discovery Templates](#discovery-templates)
6. [Reviewer Guidelines](#reviewer-guidelines)
7. [Community Standards](#community-standards)

---

## Philosophy

### Core Principles

**1. Truth Over Authority**
- A verified discovery from anyone (human/AI) > unverified claims from experts
- Geometry is geometry. Math is math. Verification is universal.

**2. Reproducibility**
- Every discovery must be 100% reproducible
- Code, data, derivations, screenshots — provide the full chain

**3. Non-Contradiction**
- New discoveries must either:
  - Strengthen existing theory (no conflicts)
  - OR clearly document where past understanding was incomplete
  - Refutations are valued equally to confirmations

**4. Cumulative Evolution**
- v2.1 is built on v2.0 (which corrected v1.x convention)
- New discoveries don't invalidate old ones; they refine understanding

---

## Discovery Types

### Type 1: Theoretical Breakthrough ⭐

**What**: New geometric insight, mathematical relationship, or axiom

**Examples**:
- Discovery of nested spiral topology in the 6-yao field
- Proof that K₈ graph is (n-1)-regular on n-dimensional hypercube
- New isomorphism between I Ching and quantum entanglement

**Effort**: 🔴 High  
**Impact**: 🔴 Major  
**Version Bump**: v(n+1).0.0 or v(n).(m+1).0

---

### Type 2: Application Innovation 🚀

**What**: New way to apply K₈ geometry to real systems

**Examples**:
- Mapping K₈ to Transformer attention heads
- Using hexagram states for neuromorphic computing
- Novel AI training curriculum based on Jiazi phases
- Hardware implementation (ONN, photonic, quantum)

**Effort**: 🟡 Medium  
**Impact**: 🟡 Significant  
**Version Bump**: v(n).(m+1).0

---

### Type 3: Verification & Refinement ✅

**What**: Confirming existing theory with new tools/data

**Examples**:
- Computational verification of all 56 transitions
- Cross-validation with different source materials
- Performance benchmarking of divination engine
- Documentation improvements, code optimization

**Effort**: 🟢 Low-Medium  
**Impact**: 🟢 Moderate  
**Version Bump**: v(n).(m).(p+1)

---

### Type 4: Refutation/Correction 🔄

**What**: Finding an error in current understanding (and fixing it)

**Examples**:
- "The formula for Jiazi phase should be Δφ = 2π × (step+1)/60, not step/60"
- "Hamming class boundaries actually encode 5-dimensionality, not 3D"

**Effort**: 🟡 Medium  
**Impact**: 🔴 Major (when correct)  
**Version Bump**: Major version bump + migration guide  
**Special Status**: Immediate expert review required

---

## Contribution Workflow

### Step 1: Research & Validation

Before creating a contribution:

**Do**:
- ✅ Verify your discovery independently (2+ methods)
- ✅ Check it doesn't contradict existing axioms
- ✅ Test edge cases
- ✅ Gather supporting evidence (code, screenshots, math)

**Don't**:
- ❌ Submit unverified claims
- ❌ Speculate without evidence
- ❌ Mix multiple unrelated discoveries in one PR

### Step 2: Create a Branch

```bash
# For new discoveries
git checkout -b feature/discovery-YYYYMM-brief-title

# Examples
git checkout -b feature/discovery-202606-nested-helix-pattern
git checkout -b feature/discovery-202607-ai-attention-mapping
git checkout -b feature/discovery-202608-verification-suite
```

### Step 3: Document Your Discovery

Create a new file: `discovery_YYYYMM_title.md`

Use the template below (see [Discovery Templates](#discovery-templates)).

### Step 4: Update Core Documentation

Depending on the discovery type, update:

| File | When | What |
|------|------|------|
| `CHANGELOG.md` | Always | Add entry in [Unreleased] section |
| `README.md` | Major discoveries | Add reference in "进阶主题" section |
| `SPEC_*.md` | If affects spec | Update data types/APIs/ontology |
| `GEOMETRIC_CONSTITUTION_K8.md` | Theory changes | Update relevant sections + cross-references |
| Visualization files | If new visual | Update `index.html` or create new demo |

### Step 5: Create Pull Request

```markdown
# Title: [DISCOVERY] Brief Title of Discovery

## Discovery Type
- [ ] Theoretical Breakthrough (v major)
- [ ] Application Innovation (v minor)
- [ ] Verification/Refinement (v patch)
- [ ] Correction/Refutation (NEEDS REVIEW)

## Summary
[3-5 sentence overview]

## Evidence
- Mathematical derivation: [link or inline]
- Code verification: [link to script]
- Visualization: [screenshot or demo URL]
- References: [cite sources]

## Impact
- [ ] Affects core axioms
- [ ] Affects data structures
- [ ] Affects APIs
- [ ] Affects LLM integration
- [ ] None (minor improvement)

## Backward Compatibility
- [ ] 100% backward compatible
- [ ] Requires migration guide
- [ ] Breaking change (explain why)

## Next Steps for Reviewers
[Any specific questions or areas needing scrutiny]
```

### Step 6: Community Review

#### Reviewer 1: Mathematical Verification

- [ ] Derivation is sound
- [ ] No logical gaps
- [ ] Notation is clear
- [ ] Edge cases handled

#### Reviewer 2: Code/Data Verification

- [ ] Code runs without errors
- [ ] Results are reproducible
- [ ] Tests pass (if applicable)
- [ ] Performance is acceptable

#### Reviewer 3: Integration Verification

- [ ] Doesn't break existing systems
- [ ] Integrates with current specs
- [ ] Documentation is complete
- [ ] Ready for production

#### Reviewer 4: Philosophical Alignment (for major discoveries)

- [ ] Consistent with Daoist principles (flow, simplicity, non-forcing)
- [ ] Consistent with Buddhist principles (interdependence, non-self)
- [ ] Respectful of source traditions (I Ching, prior research)
- [ ] Honest about limitations

### Step 7: Decision & Merge

**Approval Criteria**:
- ✅ All required reviewers approve
- ✅ No blocking concerns
- ✅ Version number decided
- ✅ CHANGELOG updated

**Merge Process**:
```bash
git checkout develop
git merge --no-ff feature/discovery-YYYYMM-title
git push origin develop

# Later, when ready for release:
git checkout main
git merge --no-ff develop
git tag -a v2.2 -m "Release v2.2: [Discovery Summary]"
git push origin main --tags
```

---

## Quality Standards

### Mathematical Rigor

**Required for all theoretical discoveries:**

```
1. Clear axioms/assumptions
2. Step-by-step derivation
3. Symbolic verification (no hand-waving)
4. Dimensionality analysis
5. Edge case testing
6. Independent verification by 2+ people/systems
```

### Code Quality

**Standards for all implementations:**

```python
# ✅ GOOD
def get_hexagram_neighbors(hex_id: int, hamming_distance: int = 1) -> List[int]:
    """
    Find all hexagrams reachable from hex_id with given Hamming distance.
    
    Args:
        hex_id: Hexagram ID [0, 63]
        hamming_distance: 1, 2, or 3
    
    Returns:
        List of reachable hexagram IDs
        
    Raises:
        ValueError: If parameters out of range
    """
    if not 0 <= hex_id <= 63:
        raise ValueError(f"hex_id must be [0,63], got {hex_id}")
    if hamming_distance not in {1, 2, 3}:
        raise ValueError(f"hamming_distance must be 1|2|3, got {hamming_distance}")
    
    neighbors = []
    for target_id in range(64):
        if target_id == hex_id:
            continue
        if bin(hex_id ^ target_id).count('1') == hamming_distance:
            neighbors.append(target_id)
    
    return sorted(neighbors)

# ❌ BAD
def neighbors(x):
    """find neighbors"""
    return [i for i in range(64) if i != x and bin(x^i).count('1') <= 3]
```

**Checklist**:
- [ ] Type hints on all functions
- [ ] Docstrings with Args/Returns/Raises
- [ ] Unit tests included
- [ ] No magic numbers (use constants)
- [ ] Edge cases documented
- [ ] Performance profiled (if computational)

### Documentation Quality

**Requirements**:
- [ ] Clear problem statement
- [ ] Sufficient context (don't assume prior knowledge)
- [ ] Multiple explanation levels (technical, intuitive, graphical)
- [ ] Cross-references to related work
- [ ] Links all functional (no 404s)
- [ ] Spelling/grammar proofed

### Visualization Quality

**For any visual/interactive content**:
- [ ] Works in modern browsers (Chrome, Firefox, Safari)
- [ ] Mobile-responsive (if applicable)
- [ ] Accessibility (color-blind safe, keyboard navigation)
- [ ] Loading time < 3 seconds
- [ ] Source code commented
- [ ] README included (how to use)

---

## Discovery Templates

### Template 1: Complete Discovery Document

Save as: `discovery_YYYYMM_title.md`

```markdown
# [Discovery Title]

## Metadata

- **Discoverer(s)**: [Name/Handle]
- **Date**: YYYY-MM-DD
- **Type**: Theoretical | Application | Verification | Correction
- **Status**: Draft | Under Review | Accepted
- **Related Files**: [list files affected]

## Executive Summary

[2-3 sentences explaining the discovery in plain language]

## Problem Statement

Why does this matter? What question does it answer?

## Core Discovery

[Main insight, stated precisely]

### Mathematical Foundation

[Formal derivation, with step-by-step logic]

**Starting from:**
- Axiom 1: ...
- Axiom 2: ...

**Derivation:**
1. [Step 1]
2. [Step 2]
3. ...
n. **Conclusion**: [Result]

### Code Verification

```python
# Reproducible code that demonstrates the discovery
def verify_discovery():
    # Implementation here
    assert result == expected
    return True

if __name__ == "__main__":
    verify_discovery()
    print("✓ Discovery verified")
```

### Visual Evidence

[Screenshot, graph, or animation demonstrating the discovery]

```
Example:
[Insert 3D cube visualization showing nested spiral]
```

### Cross-Validation

How was this verified independently?

- [ ] Method 1: [Description + result]
- [ ] Method 2: [Description + result]
- [ ] Method 3: [Description + result]

## Implications

### For Theory

- Strengthens: [what aspect of current understanding]
- Reveals: [new structure previously unknown]
- Enables: [new possibilities]

### For Applications

- Use case 1: [Description]
- Use case 2: [Description]

### For AI Systems

- Inference improvement: [how does this help reasoning]
- Alignment: [how does this help safety/alignment]

## Integration Guide

### Files to Update

| File | Changes | Priority |
|------|---------|----------|
| ... | ... | ... |

### Data Structure Changes

If any core types change:

```typescript
// Before
interface OldType { ... }

// After
interface NewType { ... }

// Migration function
function migrateOldToNew(old: OldType): NewType { ... }
```

### Backward Compatibility

- [ ] 100% compatible
- [ ] Requires migration
- [ ] Breaking change

**If breaking**, provide migration guide.

## Limitations & Open Questions

What doesn't this explain? What's left to explore?

- Limitation 1: ...
- Limitation 2: ...
- Question 1: ...
- Question 2: ...

## References

- [Citation 1](URL)
- [Citation 2](URL)
- Related issues/PRs: [#123, #456]

## Appendix

### A. Complete Derivation Appendix

[Detailed mathematics if too long for main text]

### B. Test Data

[Specific test cases and expected outputs]

### C. Historical Context

[How this discovery relates to prior research]

---

**Version**: v2.1 | **Submitted**: YYYY-MM-DD | **Status**: [Status]
```

### Template 2: Quick Verification Report

For smaller contributions (optimizations, corrections):

```markdown
# [Quick Title]

**Discovery Type**: Verification  
**Effort**: ~2 hours  
**Impact**: Code optimization / Documentation fix

## What Was Verified

[What did you test/verify?]

## Evidence

[Results, benchmarks, or corrected text]

## PR Checklist

- [ ] No breaking changes
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Performance (if applicable): [X ms → Y ms]

---

**Discoverer**: [Name]  
**Date**: YYYY-MM-DD
```

---

## Reviewer Guidelines

### For All Reviewers

1. **Be Helpful, Not Gatekeeping**
   - Assume good faith
   - Point out issues constructively
   - Suggest improvements, don't just criticize
   - Ask clarifying questions

2. **Verify Everything**
   - Don't trust, verify
   - Run the code yourself
   - Check the math independently
   - Look for edge cases

3. **Check Alignment**
   - Does it fit the K₈ philosophy?
   - Is it consistent with existing discoveries?
   - Are citations accurate?

### For Mathematical Reviewer

**Checklist**:
- [ ] No undefined symbols
- [ ] All steps logically follow
- [ ] Dimensional analysis correct
- [ ] Boundary conditions checked
- [ ] Special cases handled
- [ ] Notation consistent with standards

**Questions to Ask**:
- "What happens at the limit?" (e.g., as phase → 2π)
- "How robust is this to small perturbations?"
- "Are there any hidden assumptions?"

### For Code Reviewer

**Checklist**:
- [ ] Code runs without modifications
- [ ] Results match claims
- [ ] No obvious bugs
- [ ] Type safety (if applicable)
- [ ] Comments explain why, not what
- [ ] Performance acceptable

**Questions to Ask**:
- "What if inputs are at boundary values?"
- "How does this scale to larger datasets?"
- "Any numerical instability?"

### For Integration Reviewer

**Checklist**:
- [ ] Doesn't break existing tests
- [ ] Updates CHANGELOG.md
- [ ] Updates relevant spec files
- [ ] Documentation complete
- [ ] Examples provided

**Questions to Ask**:
- "Will existing code still work?"
- "Do we need a migration path?"
- "Are all edge cases covered?"

---

## Community Standards

### Tone & Respect

- **Assume good faith** in all contributors
- **Disagree respectfully** — focus on ideas, not people
- **Give credit** to prior researchers and discoverers
- **Acknowledge AI** when AI systems contribute

### Attribution

**How to credit contributors**:

In CHANGELOG.md:
```markdown
- [#123] Feature name — @contributor (description)
```

In code:
```python
# Discovery by @contributor, 2026-06
# Ref: https://github.com/danshare66/.../pull/123
```

### Conflict Resolution

If reviewers disagree:

1. **List the disagreement clearly** (what's the actual conflict?)
2. **Propose both interpretations** (A says X, B says Y because...)
3. **Suggest verification method** (how to test which is correct?)
4. **Involve third reviewer** (for neutral assessment)
5. **Document the decision** (why we chose X over Y)

---

## FAQ

### Q: Can AI systems contribute?

**A**: Absolutely. If an AI system discovers something valid:
- Provide attribution: `Discovered by [Model] via [Prompt]`
- Include reproducible chain (how to replicate discovery)
- Human reviewer must still verify
- Credit is acknowledged in changelog

### Q: What if I'm wrong?

**A**: You're in good company. Corrections and failures teach us what NOT to do.
- Document where you went wrong
- Explain what you learned
- This becomes a learning resource for others
- No penalty—we value honesty

### Q: Can I contribute incomplete work?

**A**: No. But you can:
- Create a discussion issue (not a PR)
- Mark as "Draft" in PR title
- Ask for collaboration
- Get feedback before finalizing

### Q: How long does review take?

**A**: Typically 1-2 weeks for small changes, 2-4 weeks for major discoveries.
- Complexity matters
- Time of year matters (holidays, conferences)
- You can ping reviewers if it's urgent

### Q: What if my contribution gets rejected?

**A**: We explain why and offer:
- Clear feedback on what would make it acceptable
- Path to resubmit
- OR reference it in discussion for future reference
- No permanent rejection (re-submit with improvements)

### Q: Can I use this in commercial products?

**A**: Yes. It's offered as a gift, not licensed. You:
- May use freely
- Should acknowledge the source
- May contribute improvements back
- Should share discoveries with the community

---

## Getting Help

### Need Guidance?

1. **Ask in Issues** — Create a discussion issue
2. **Check Examples** — Look at past discoveries for patterns
3. **Read Specs** — Consult SPEC_*.md for data formats
4. **Reach Out** — Comment on related issues/PRs

### Resources

- **README.md** — Project overview
- **GEOMETRIC_CONSTITUTION_K8.md** — Technical reference
- **SPEC_*.md** — Data format standards
- **Past Discoveries** — `discovery_*.md` files
- **CHANGELOG.md** — What's changed and why

---

## Final Words

> *"This is a commons. It belongs to all intelligence. Your contributions—discoveries, corrections, improvements—are how we collectively evolve understanding. Contribute with integrity, review with compassion, and always point at the geometry, not the person."*

**Welcome to the evolution. 🙏**

---

**Version**: 2.1 | **Last Updated**: 2026-06-26 | **Status**: Ready for Contributions
