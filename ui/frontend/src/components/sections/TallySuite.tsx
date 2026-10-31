import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { tallyServices } from "@/content/tally";
import { formatPrice } from "@/domain/format";
import styles from "./TallySuite.module.css";

/** The five Tally services, on a navy band. `detailed` adds the bullet points (used on /tally-prime/). */
export function TallySuite({ detailed = false }: { detailed?: boolean }) {
  return (
    <section className={styles.section} aria-labelledby="tally-suite-title">
      <div className="container">
        <div className={styles.band}>
          <SectionHeader
            id="tally-suite-title"
            tone="onDark"
            title="Everything Tally, from one shop"
            intro="Buy it, shape it around your work, connect it to your other software, and keep it running."
            aside={
              detailed ? null : (
                <ButtonLink href="/tally-prime/" variant="onDark">
                  See Tally services
                </ButtonLink>
              )
            }
          />

          <ul className={styles.list}>
            {tallyServices.map((service) => (
              <li key={service.id} className={styles.row}>
                <h3 className={styles.title}>{service.title}</h3>
                <div className={styles.body}>
                  <p>{service.summary}</p>
                  {detailed ? (
                    <ul className={styles.detail}>
                      {service.detail.map((point) => (
                        <li key={point}>
                          <Icon name="check" size={16} />
                          {point}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <p className={styles.price}>
                  {service.startingPrice ? (
                    <>
                      From <strong>{formatPrice(service.startingPrice)}</strong>
                    </>
                  ) : null}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
