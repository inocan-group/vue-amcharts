export const serpentineDataset: { date: Date; value: number }[] = []
let visits = 100

for (let i = 0; i < 24; i++) {
  visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10)
  serpentineDataset.push({ date: new Date(2018, 0, 1, i), value: visits })
}
