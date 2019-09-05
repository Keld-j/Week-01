# Week-01
Small project for the first week of the course Make Money with Machine Learning.

# Bugs fixed
1. Sometime the model gave a prediction with a probability of "undefined".  This bug occured when clicking on either "Class B" or "Class C" before clicking on "Class A".
The bug was caused by the fact that "result.ClassIndex" returned index [0] and when printing this index back to the user resulted in "Class A". Using parseInt(result.label) instead fixed the bug.

# TO-DO list
Small bugfixes:
1. The UI could use an update.
