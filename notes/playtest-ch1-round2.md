# Second learner playthrough of 1교시 (after the first round of fixes)

A fresh agent played as a TOPIK-3 learner, using only the screen. It got 26 of 27 questions right; the one wrong answer came from
d-pad input at the moment a question appeared, now fixed in the engine. It was "never stuck for long" and praised the mystery,
the Korean definitions, 사전, the 일지 and how the game explains itself.

## Engine fixes already done
- D-pad and A are ignored for 450 ms after a question appears.
- No ! is drawn over the player standing just above an NPC.
- DONE lines are narration ("…"), not 단어 일지.

## 1교시 content to fix
1. **One name for the review spot.** The learner saw 단어 일지 (the log badge), 학급 일지 (in the objective) and 복습 노트 (the review
   dialogue and the ★ message) and didn't know where to review. The engine calls the review spot **복습 노트**, so the objective and any line
   pointing to it should say 복습 노트 (e.g. "교탁 위 복습 노트"). Keep 단어 일지 only for the player's word log.
2. **The "내 자리 찾기" objective is skipped.** A ! appeared over the desk, but the story moved on before the player could sit.
   Make sitting at that desk the thing that starts class (or drop the objective).
3. **Doors should match where you arrive.**
   - The classroom door is in the right wall, but leaving it puts you under a door in the corridor's top wall.
   - Walking down into the cafeteria puts you at its bottom, facing up, so pressing down twice goes out and straight back in.
   - Make arrival positions and facing match the direction of the door you used.
4. **Two answers fit.**
   - **또래/동갑:** in "다 ___이에요", only the particle rules one out. Rewrite so the meaning decides, not the 이.
   - **전할까요/전할게요:** in "제가 ___", both are natural offers. Rewrite the context so only one fits.
   - **걷다:** the great note ("걸어요는 발로 가는 걷다") only shows in the 일지. Put it in the dialogue, e.g. 다온 explains after the question.
5. **Korean and logic slips.**
   - "밥을 다 먹었어요. 불고기가 진짜 맛있어요" should be 맛있었어요.
   - "부원이 없으면 방송부는 문을 닫습니다" contradicts 구름 being a member; use e.g. "부원이 다섯 명이 안 되면".
   - "이거 교장 선생님한테 전해 줄 수 있어요?" reads like returning the principal's own notice to her. Make clear it's 구름's
     request or answer to the notice.
   - The final note is missing its closing quote mark.
   - In the word tiles "방송부를 하고 싶다고 전할게요", it's unclear who wants to join. Make it clearly the player.
6. **Mentioned but not visible.**
   - The opening says "진짜 큰 나무가 있어요", but the first view shows no tree. Start the camera or player where the 느티나무 is visible.
   - 다온 says "이 저금통 보여?", but there's no piggy bank. Add a 저금통 object next to her (inspectable).
7. **Minor.**
   - 정 선생님's shirt colour is close to her skin tone, so her portrait reads as bare shoulders. Give her a clearly different top colour.
   - Review questions reuse the story sentences word for word, so the learner remembered the sentence, not the word. Add BANK
     questions in new sentences for the words most likely to be answered from memory.
