import { TherapyTools } from "../types";
import "./Dashboard.css";

interface TherapyToolsViewProps {
  therapyTools: TherapyTools | null | undefined;
  onEdit: () => void;
}

const TherapyToolsView = ({ therapyTools, onEdit }: TherapyToolsViewProps) => {
  if (!therapyTools) {
    return (
      <div className="therapy-card mt-6">
        <div className="therapy-header">
          <h2 className="therapy-title">Therapy Tools</h2>
          <button
            onClick={onEdit}
            className="btn-primary"
          >
            Add Therapy Tools
          </button>
        </div>
        <div className="text-center py-8 text-gray-500">
          No therapy tools have been recorded yet.
        </div>
      </div>
    );
  }

  return (
    <div className="therapy-card mt-6">
      <div className="therapy-header">
        <h2 className="therapy-title">Therapy Tools</h2>
        <button
          onClick={onEdit}
          className="btn-primary"
        >
          Edit Therapy Tools
        </button>
      </div>

      <div className="space-y-6">
        {/* General Tools Section */}
        {(therapyTools.mantras || therapyTools.meditationTypes || therapyTools.bandhas) && (
          <div className="tools-section">
            <h3 className="tools-section-title">General Tools</h3>
            <div className="therapy-tools-grid">
              {therapyTools.mantras && (
                <div className="therapy-item">
                  <span className="detail-label">Mantras</span>
                  <p className="detail-value detail-multiline">{therapyTools.mantras}</p>
                </div>
              )}

              {therapyTools.meditationTypes && (
                <div className="therapy-item">
                  <span className="detail-label">Meditation Types</span>
                  <p className="detail-value detail-multiline">{therapyTools.meditationTypes}</p>
                </div>
              )}

              {therapyTools.bandhas && (
                <div className="therapy-item">
                  <span className="detail-label">Bandhas</span>
                  <p className="detail-value detail-multiline">{therapyTools.bandhas}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Yoga Section */}
        {therapyTools.yoga && (therapyTools.yoga.poses || therapyTools.yoga.repeatingTimingsPerDay) && (
          <div className="tools-section">
            <h3 className="tools-section-title">Yoga</h3>
            <div className="space-y-4">
              {therapyTools.yoga.poses && (
                <div className="therapy-item">
                  <span className="detail-label">Poses</span>
                  <p className="detail-value detail-multiline">{therapyTools.yoga.poses}</p>
                </div>
              )}

              {therapyTools.yoga.repeatingTimingsPerDay !== undefined &&
                therapyTools.yoga.repeatingTimingsPerDay > 0 && (
                  <div className="therapy-item">
                    <span className="detail-label">
                      Repeating Timings Per Day
                    </span>
                    <p className="detail-value">{therapyTools.yoga.repeatingTimingsPerDay}</p>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Pranayama Section */}
        {therapyTools.pranayama &&
          (therapyTools.pranayama.techniques || therapyTools.pranayama.repeatingTimingsPerDay) && (
            <div className="tools-section">
              <h3 className="tools-section-title">Pranayama</h3>
              <div className="space-y-4">
                {therapyTools.pranayama.techniques && (
                  <div className="therapy-item">
                    <span className="detail-label">Techniques</span>
                    <p className="detail-value detail-multiline">{therapyTools.pranayama.techniques}</p>
                  </div>
                )}

                {therapyTools.pranayama.repeatingTimingsPerDay !== undefined &&
                  therapyTools.pranayama.repeatingTimingsPerDay > 0 && (
                    <div className="therapy-item">
                      <span className="detail-label">
                        Repeating Timings Per Day
                      </span>
                      <p className="detail-value">{therapyTools.pranayama.repeatingTimingsPerDay}</p>
                    </div>
                  )}
              </div>
            </div>
          )}

        {/* Mudras Section */}
        {therapyTools.mudras &&
          (therapyTools.mudras.mudraNames || therapyTools.mudras.repeatingTimingsPerDay) && (
            <div className="tools-section">
              <h3 className="tools-section-title">Mudras</h3>
              <div className="space-y-4">
                {therapyTools.mudras.mudraNames && (
                  <div className="therapy-item">
                    <span className="detail-label">Mudra Names</span>
                    <p className="detail-value detail-multiline">{therapyTools.mudras.mudraNames}</p>
                  </div>
                )}

                {therapyTools.mudras.repeatingTimingsPerDay !== undefined &&
                  therapyTools.mudras.repeatingTimingsPerDay > 0 && (
                    <div className="therapy-item">
                      <span className="detail-label">
                        Repeating Timings Per Day
                      </span>
                      <p className="detail-value">{therapyTools.mudras.repeatingTimingsPerDay}</p>
                    </div>
                  )}
              </div>
            </div>
          )}

        {/* Breathing Exercises Section */}
        {therapyTools.breathingExercises &&
          (therapyTools.breathingExercises.exercises ||
            therapyTools.breathingExercises.repeatingTimingsPerDay) && (
            <div className="tools-section">
              <h3 className="tools-section-title">Breathing Exercises</h3>
              <div className="space-y-4">
                {therapyTools.breathingExercises.exercises && (
                  <div className="therapy-item">
                    <span className="detail-label">Exercises</span>
                    <p className="detail-value detail-multiline">{therapyTools.breathingExercises.exercises}</p>
                  </div>
                )}

                {therapyTools.breathingExercises.repeatingTimingsPerDay !== undefined &&
                  therapyTools.breathingExercises.repeatingTimingsPerDay > 0 && (
                    <div className="therapy-item">
                      <span className="detail-label">
                        Repeating Timings Per Day
                      </span>
                      <p className="detail-value">{therapyTools.breathingExercises.repeatingTimingsPerDay}</p>
                    </div>
                  )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default TherapyToolsView; 