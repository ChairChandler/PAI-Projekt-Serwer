import Schedule from 'node-schedule'

class JobsStorage {
    private jobs: Schedule.Job[] = []

    setJob(tournament_id: number, job: Schedule.Job) {
        this.jobs[tournament_id] = job
    }

    reschedule(tournament_id: number, date: Date) {
        this.jobs[tournament_id] = Schedule.rescheduleJob(this.jobs[tournament_id], date)
    }
}

export default new JobsStorage()